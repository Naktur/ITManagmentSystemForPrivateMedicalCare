# backend/analytics/views.py
from datetime import date
from collections import Counter

from django.db.models.functions import TruncMonth
from django.db.models import Count
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from appointments.models import Appointment

def age_from_dob(dob):
    if not dob:
        return None
    today = date.today()
    return today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

def age_group(age):
    if age is None:
        return "nieznany"
    if age < 18:
        return "0-17"
    if age < 30:
        return "18-29"
    if age < 45:
        return "30-44"
    if age < 60:
        return "45-59"
    return "60+"

class StatsOverviewView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Appointment.objects.select_related("patient__user").all()

        # — Choroby per miesiąc (ostatnie 12 m-cy)
        by_month_qs = (
            qs.exclude(diagnosis="")
              .annotate(month=TruncMonth("scheduled_at"))
              .values("month")
              .annotate(count=Count("id"))
              .order_by("month")
        )
        by_month = [
            {"month": x["month"].strftime("%Y-%m"), "count": x["count"]}
            for x in by_month_qs
        ]

        # — Top 5 chorób
        disease_counts = Counter(
            a.diagnosis.strip().lower()
            for a in qs
            if a.diagnosis.strip()
        )
        top_diseases = [{"name": k, "count": v} for k, v in disease_counts.most_common(5)]

        # — Wg płci
        by_gender = (
            qs.values("patient__gender")
              .annotate(count=Count("id"))
              .order_by()
        )
        by_gender = [
            {"gender": (x["patient__gender"] or "unknown"), "count": x["count"]}
            for x in by_gender
        ]

        # — Wg grup wiekowych
        age_counter = Counter()
        for a in qs:
            age_val = age_from_dob(getattr(a.patient, "date_of_birth", None))
            age_counter[age_group(age_val)] += 1
        by_age = [{"group": k, "count": v} for k, v in sorted(age_counter.items())]

        return Response({
            "by_month": by_month,
            "top_diseases": top_diseases,
            "by_gender": by_gender,
            "by_age": by_age,
        })
