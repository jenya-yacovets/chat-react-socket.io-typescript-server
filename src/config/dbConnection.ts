import {createConnection} from "typeorm"

let connection

(async () => {
    try {
        connection = await createConnection()
        console.log('Connection to DB')
    } catch(error) {
        throw error
    }
})()

export default connection