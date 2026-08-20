import * as fs from 'fs/promises'


export async function readFile(filepath:string){
    try {
       const raw = await fs.readFile(filepath, 'utf-8')
       return JSON.parse(raw)

       console.log(raw);
       

    } catch (error) {
        console.log('Error in reading file' );
        throw error
        
    }
}

export async function writeData(filepath:string, data:unknown){
    try {
        fs.writeFile(filepath, JSON.stringify(data, null, 2))
    } catch (error) {
        console.log('error in writing data');
        throw error
        
    }
}


// readFile('src/data/books.json').then((data) => console.log(data))

writeData('src/data/testWrite.json', [{ id: "1", title: "Test Book" }])
  .then(() => console.log('Write successful'));

