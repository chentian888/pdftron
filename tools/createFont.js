const fs = require('fs-extra');
const { resolve } = require('path');

function getAllFiles(filePath) {
  let allFilePaths = [];
  if (fs.existsSync(filePath)) {
    const files = fs.readdirSync(filePath);
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const text = file.split('.')[0];
      allFilePaths.push(text);
      console.log(text);
    }
  } else {
    console.warn(`指定的目录${filePath}不存在！`);
  }
  return allFilePaths;
}

async function main() {
  const all = getAllFiles('./fonts');
  const content = JSON.stringify(all);

  try {
    fs.writeFile('./src/fonts.json', content, function (err) {
      if (err) {
        return console.log(err);
      }
      console.info('字体文件创建成功，地址：src/' + 'fonts.json');
    });
    await fs.copy('./fonts', './public/webviewer/lib/ui/assets/fonts');
    console.info('字体文件移动成功');
  } catch (err) {
    console.error(err);
  }
}
main();
