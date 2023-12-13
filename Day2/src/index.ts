export const incrementString = (str: string) => {
    // foobar00

    str
    .split("")
    .reverse()
    //.findIndex((item) => item.charCodeAt(0) < 48 && item.charCodeAt(0) >57)
    .findIndex((item) => Number.isNaN(item))
    console.log("index", index)
}

incrementString("foobar000")
incrementString("pippo33awda00")