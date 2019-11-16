from flask import Flask,send_from_directory
import os
import script

folder = 'public'
for f in os.listdir(folder):
    file_path = os.path.join(folder, f)
    try:
        if os.path.isfile(file_path):
            os.unlink(file_path)
    except Exception as e:
        print(e)

open('./public/img.png','w')

app = Flask(__name__,static_folder=os.path.abspath("public/"))

@app.route("/")
def index():
    return script.onConnect()

@app.route("/start/")
def start():
    return script.onStart()

@app.route('/img/<path:path>')
def static_file(path):
    return app.send_static_file(path)

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True)