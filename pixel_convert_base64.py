# coding:utf-8
from flask import Flask, render_template, request, redirect, url_for, abort, logging
import os
import cv2
from PIL import Image
import hashlib
import datetime as dt
from pixel_64 import make_dot
import base64
from io import BytesIO

app = Flask(__name__)
config = {'MAX_CONTENT_LENGTH': 1024 * 1024 * 2, 'DEBUG': False}
app.config.update(config)


@app.route('/', methods=['GET'])
def index():
    return render_template('pixel.html')


@app.route('/', methods=['POST'])
def post():
    if (not request.files['uploadFile']) and ("base64," in request.form['prev_img']):
        print("同じ画像の使いまわしだよ, base64文字から読み解くよ")
        image_str = request.form['prev_img'].split(",")[1]
        img_raw = base64.b64decode(image_str)
        img = Image.open(BytesIO(img_raw))
    else :
        print("画像がアップロードされたよ!FlaskのFileStorageからPIL imageに変換")
        img = Image.open(request.files['uploadFile'])
    print(img)
    if not img:
        error='ファイルを選択してね'
        return render_template('pixel.html', error=error)
    k = int(request.form['k'])
    scale = int(request.form['scale'])
    blur = int(request.form['blur'])
    erode = int(request.form['erode'])
    try:
        alpha = bool(int(request.form['alpha']))
    except:
        alpha = False
    try:
        to_tw = bool(int(request.form['to_tw']))
    except:
        to_tw = False
    img_name = hashlib.md5(str(dt.datetime.now()).encode('utf-8')).hexdigest() + ".png"
    if max(img.size) > 1024:
        img.thumbnail((1024, 1024), Image.ANTIALIAS)
        print(img)
    img_res, colors = make_dot(img, k=k, scale=scale, blur=blur, erode=erode, alpha=alpha)
    buffered = BytesIO()
    img.save(buffered,"png")
    img_str = base64.b64encode(buffered.getvalue())
    img_src = f"data:image/png;base64,{str(img_str)[2:-1]}"
    _, encoded = cv2.imencode(".png", img_res)
    result_str = base64.b64encode(encoded)
    result_src = f"data:image/png;base64,{str(result_str)[2:-1]}"
    return render_template('pixel.html', org_img=img_src, result=result_src, res_name=img_name, colors=colors, k=k,scale=scale,blur=blur,erode=erode)


@app.errorhandler(413)
def error_file_size(e):
    error = 'ファイルサイズが大きすぎます。アップロード可能サイズは2MBまでです。'
    return render_template('pixel.html', error=error), 413


@app.errorhandler(404)
def not_found(e):
    error = 'らめぇ'
    return render_template('pixel.html', error=error), 404


if __name__ == '__main__':
    app.run()

