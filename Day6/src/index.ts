const url = "https://jsonplaceholder.typicode.com/posts"




const sample = () =>{
    console.time()
    fetch(url)
    .then(data) => data.json()
    .then(data) =>{
        console.log("data:", data)
        console.timeEnd()
    }
    .catch() => console.log("Errore")
    console.log("Sono qui")
}
sample()

const url = "https://jsonplaceholder.typicode.com/posts";

const sample = () => {
    console.time();
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log("data:", data);
            console.timeEnd();
        })
        .catch((error) => console.log("Errore:", error));
    console.log("Sono qui");
};

sample();