import fs from "fs";
import Jimp from "jimp";
import axios from "axios";

function readImageFromURL(inputURL) {
    return axios({
        method: "get",
        url: inputURL,
        responseType: "arraybuffer",
    }).then(function ({data: imageBuffer}) {
        return Jimp.read(imageBuffer);
    });
}

export async function filterImageFromURL(inputURL) {
    return new Promise(async (resolve, reject) => {
        try {
            // const photo = await Jimp.read(inputURL);
            const photo = await readImageFromURL(inputURL);
            const outpath =
                "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
            await photo
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .greyscale() // set greyscale
                .write(outpath, (img) => {
                    resolve(outpath);
                });
        } catch (error) {
            reject(error);
        }
    });
}

export async function deleteLocalFiles(files) {
    for (let file of files) {
        fs.unlinkSync(file);
    }
}
