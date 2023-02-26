import server from "./app";


const port: String = "8080";

server.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});


