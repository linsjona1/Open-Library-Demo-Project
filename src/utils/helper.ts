import * as fs from 'fs/promises'


export async function readFile(filepath:string){
    try {
       const raw = await fs.readFile(filepath, 'utf-8')
       return JSON.parse(raw)
    } catch (error) {
        console.log('Error in reading file' );
        throw error
    }
}

export async function writeFile(filepath:string, data:unknown){
    try {
      await  fs.writeFile(filepath, JSON.stringify(data, null, 2))
    } catch (error) {
        console.log('error in writing data');
        throw error
        
    }
}