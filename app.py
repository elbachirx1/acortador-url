
import os
import random
import string
from  datetime import datetime
from flask import Flask, request, jsonify, redirect, render_template
from dotenv import load_dotenv
from supabase import create_client, Client

#  cargar variales del entorno .env
load_dotenv()

#  inicializar flask y supabase
app = Flask(__name__)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)


def generar_codigo(longitud=6):   # genera un codigo aleatorio alfanumerico
    caracteres = string.ascii_letters + string.digits
    return ''.join(random.choice(caracteres) for i in range(longitud))


@app.route('/')
def home():  # renderiza el index.html
    return render_template('index.html')

@app.route('/api/corta', methods=['POST'])
def url_corta():
    data = request.get_json()
    url_larga = data.get('url')
    fecha_caducidad = data.get('expires_at')
    
    if not url_larga:
        return jsonify({'ERROR': 'Por favor, ingresa una URL válida'}), 400
    
    if not url_larga.startswith(("http://", "https://")): # si la url no tiene https la añadimos
        url_larga = "https://" + url_larga
    
    codigo_corto = generar_codigo()
    
    # guardar en supabase
    try:
        supabase.table('urls').insert({
            'short_code': codigo_corto,
            'original_url': url_larga,
            'expires_at': fecha_caducidad if fecha_caducidad else None
        }).execute()
    
        url_acortada = request.host_url + codigo_corto
        return jsonify({'short_url': url_acortada}), 200
    
    except:
        return jsonify({'ERROR': 'Hubo un error al guardar la URL.'}), 500
         

@app.route('/<short_code>')
def redireccionar_a_url(short_code):   # funcion que redirige a la URL original
    try:
        respuesta = supabase.table('urls').select('original_url', 'expires_at').eq('short_code', short_code).execute()
    
        if len(respuesta.data) > 0:
            url_original = respuesta.data[0]['original_url']
            fecha_limite_str = respuesta.data[0]['expires_at']
            
            if fecha_limite_str:
                fecha_limite_limpia = fecha_limite_str.replace('Z', '').split('+')[0]
                fecha_limite = datetime.strptime(fecha_limite_limpia[:19], "%Y-%m-%dT%H:%M:%S")
                fecha_actual = datetime.utcnow()
                
                if fecha_actual > fecha_limite:
                    return render_template('index.html', error="Lo sentimos, este enlace ha caducado de forma definitiva."), 410
                
            return redirect(url_original)
        
        else:
            return render_template('index.html', error="El enlace no existe."), 404
    except Exception as e:
        print("EL SERVIDOR DETECTÓ UN ERROR EN LA REDIRECCIÓN:", str(e))
        return render_template('index.html', error="Error en el servidor."), 500
    
if __name__ == '__main__':
    app.run(debug=True)
