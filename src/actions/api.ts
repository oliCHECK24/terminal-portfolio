
'use server';
import { Option } from '@/components/EditData/ProfileEditor';
import fs from 'fs';
let username = "";

export const setUsername = (name: string) => {
  username = name;
};

export const getUsername = () => {
  return username;
};

export const getData = async (name?:string) => {
  if(!name) {
    const data = await import(`@/assets/data.json`);
    return data.default;
  }
    let data ;
    try {
      data = await import(`@/../data/${name}.json`);
    } catch (e) {
      data = await import(`@/assets/data.json`);
      data.default.options = [];
    }
  return data.default;
};

export const adaptUsername = (oldUsername: string, newUsername: string) => {
  fs.renameSync(`${process.cwd()}/data/${oldUsername}.json`, `${process.cwd()}/data/${newUsername}.json`);
}


export const saveData = async (data: Option[], name?:string) => {
  if(!name) {
    const oldData = await import(`@/assets/data.json`);
    const newData = {...oldData.default, options:data};
    fs.writeFileSync(`${process.cwd()}/src/assets/data.json`, JSON.stringify(newData, null, 2));
    return
  }
    let oldData ;
    try {
      oldData = await import(`@/../data/${name}.json`);
    } catch (e) {
      oldData = await import(`@/assets/data.json`);
    }
    const newData = {...oldData.default, options:data};
    fs.writeFileSync(`${process.cwd()}/data/${name}.json`, JSON.stringify(newData, null, 2));
};