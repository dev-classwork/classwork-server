import fs from 'fs';
import util from 'util';
import dateReturn from './dateReturn';

export default function writeFile(filename: string, d: any) {

  filename = filename.split("https://api.github.com/repos/")[1];
  filename = filename.replace("/commits", "");
  filename = filename.replace("/", "[@]");

  let dir = __dirname + `/../logs/global/${filename}.log`;

  if(d.includes("Coletando dados do repositório salvo no github")){
    d = `-------------------------------------------------------------------------------------------------------\n${dateReturn()}Novo processo\n------------------------------------------------------------------------------------------------------- \n` + d; 
  }
  let file = fs.createWriteStream(dir, { flags: 'a' });
  file.write(util.format(d) + '\n');
  file.end();
};
