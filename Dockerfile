FROM python:3.10-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt gunicorn

# Copy application code
COPY api.py ./

EXPOSE 8000

# Production server command (per specification)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "api:app"]
