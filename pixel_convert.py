# coding:utf-8
from flask import Flask, render_template, request, redirect, url_for, abort, logging
import os
import shutil
import cv2
from PIL import Image
import hashlib
import datetime as dt
from pixel import make_dot

app = Flask(__name__)
config = {'MAX_CONTENT_LENGTH': 1024 * 1024 * 2, 'DEBUG': False}
app.config.update(config)

@app.route('/', methods=['GET'])
def index():
    return render_template('pixel.html')


@app.route('/', methods=['POST'])
def post():
    if (request.form['prev_img'] != "") & (not request.files['uploadFile']):
        # 前回と同じ画像の使いまわし！
        img = Image.open(request.form['prev_img'])
        filename =request.form['prev_img'].replace('static/img/','').replace('.png','')
    else:
        # 新しい画像の送信！
        # 前の画像がimgディレクトリにのこってたら削除！
        shutil.rmtree('static/img')
        os.mkdir('static/img')
        img = request.files['uploadFile']
        filename = img.filename.replace('.png','')
    if not img:
        error='ファイルを選択してね'
        return render_template('pixel.html', error=error)
    # 前回の生成画像を削除
    shutil.rmtree('static/results')
    os.mkdir('static/results')

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
    img_name = filename + "_" + request.form['k'] + "_" + request.form['scale'] + "_" + request.form['blur'] + "_" + request.form['erode']
    if (request.form['prev_img'] != "") & (not request.files['uploadFile']):
        img_path =request.form['prev_img']
    else:
        img_path = os.path.join('static/img', filename + os.path.splitext(img.filename)[-1])
    result_path = os.path.join('static/results', img_name + '.png')
    img.save(img_path)
    with Image.open(img_path) as img_pl:
        if max(img_pl.size) > 1024:
            img_pl.thumbnail((1024, 1024), Image.ANTIALIAS)
            img_pl.save(img_path)
    img_res, colors = make_dot(img_path, k=k, scale=scale, blur=blur, erode=erode, alpha=alpha)
    cv2.imwrite(result_path, img_res)
    return render_template('pixel.html', org_img=img_path, result=result_path, colors=colors, k=k,scale=scale,blur=blur,erode=erode)


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
