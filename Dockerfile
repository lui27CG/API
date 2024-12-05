# Usa la imagen base de Python 3.13
FROM python:3.13-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copiar el archivo requirements.txt
COPY requirements.txt /app/requirements.txt

# Instalar las dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del proyecto
COPY app/ /app

# Exponer el puerto para Flask
EXPOSE 5000

# Comando para iniciar la aplicación
CMD ["python", "app.py"]
