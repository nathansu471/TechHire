FROM python:3.11-slim
WORKDIR /app
COPY remoteok_import.py .
RUN pip install --no-cache-dir requests mysql-connector-python
CMD ["python", "remoteok_import.py"]
