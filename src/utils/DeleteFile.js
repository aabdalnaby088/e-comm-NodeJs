import * as fs from 'fs';
import path from 'path';
export function deleteFileByName(folderPath, fileName) {    
    const filePath = path.join(folderPath, fileName);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Error deleting file: ${err.message}`);
            return;
        }
        console.log(`File ${fileName} deleted successfully.`);
    });
}