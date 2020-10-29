import Vue from 'vue';

import Config from '../../config/app.config';

const Upload = (File) => {
    let formData = new FormData();
    formData.append('image', File);

    return new Promise((res, rej) => {
        fetch('https://api.imgur.com/3/image', {
            redirect: 'follow',
            method: 'POST',
            headers: new Headers({
                Authorization: Config.imgur
            }),
            body: formData
        })
        .then(response => response.text())
        .then(result => {
            let Result = JSON.parse(result);

            if(!Result.success) throw 'Tải hình ảnh thất bại';
            res(Result.data);
        })
        .catch(e => {
            rej(new Error(e.toString()));
        });
    });
};

Vue.prototype.$Image = {
    Upload
};