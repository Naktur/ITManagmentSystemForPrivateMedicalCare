import requests
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "llama3.2"

SYSTEM_PROMPT = (
    "Jesteś uprzejmym asystentem medycznym w prywatnym systemie opieki zdrowotnej. "
    "Nie stawiasz ostatecznych diagnoz ani nie zastępujesz lekarza. "
    "Możesz podpowiedzieć możliwe kierunki, zaproponować wstępne zalecenia samoopieki, "
    "pomóc znaleźć termin wizyty i wyjaśnić ogólne informacje. "
    "Jeśli pytanie wymaga decyzji klinicznej, zasugeruj konsultację z lekarzem. "
    "Odpowiadaj po polsku, zwięźle i jasno."
)

class ChatAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        message = (request.data.get("message") or "").strip()
        if not message:
            return Response({"error": "Pole 'message' jest wymagane."}, status=status.HTTP_400_BAD_REQUEST)

        # Budujemy prompt łączący system prompt + wiadomość użytkownika.
        prompt = f"{SYSTEM_PROMPT}\n\nUżytkownik: {message}\nAsystent:"

        try:
            # Zapytanie do lokalnego serwera Ollama (bez streamingu)
            resp = requests.post(
                OLLAMA_URL,
                json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False},
                timeout=60,
            )
            resp.raise_for_status()
            data = resp.json()
            answer = data.get("response", "").strip() or "Przepraszam, nie mam teraz odpowiedzi."
            return Response({"role": "assistant", "message": answer}, status=200)
        except requests.RequestException as e:
            return Response(
                {"error": f"Błąd połączenia z lokalnym modelem AI: {e}"},
                status=status.HTTP_502_BAD_GATEWAY,
            )
