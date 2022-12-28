import axios from "axios";

// export async function helperFetch (array){

//     return await Promise.all(
//        array.map(async (bookId) => {
//           return axios
//             .get(`https://openlibrary.org/works/${bookId}.json`)
//             .then((res) => {

//               res.data = {
//                 ...res.data,
//                 hello:"hello",
//                 title : res.data.title || "title does not exist",
//                 cover_i: res.data.cover_i? `https://covers.openlibrary.org/b/id/${res.data.cover_i}-L.jpg` : Array.isArray(res.data.covers)? `https://covers.openlibrary.org/b/id/${res.data.covers[0]}-L.jpg` : "https://via.placeholder.com/200x300",
//                 publisher : !res.data.publisher? "publisher not available" : typeof res.data.publisher === "string"? res.data.publisher : res.data.publisher[0],
//                 publishedAt : res.data.first_publish_year,
//                 }
//                 return res.data
//             })
//             .catch((error) => {
//               console.log(error);
//               return { errorMsg: `book not available ${bookId}` };
//             });
//         })
//       );
//     }
// export async function helperFetch (array){

//     return  await Promise.all(
//        array.map(async (bookId) => {
//           return axios
//             .get(`https://openlibrary.org/works/${bookId}.json`)
//             .then((res) => {

//               res.data = {
//                 ...res.data,
//                 hello:"hello",
//                 title : res.data.title || "title does not exist",
//                 cover_i: res.data.cover_i? `https://covers.openlibrary.org/b/id/${res.data.cover_i}-L.jpg` : Array.isArray(res.data.covers)? `https://covers.openlibrary.org/b/id/${res.data.covers[0]}-L.jpg` : "https://via.placeholder.com/200x300",
//                 publisher : !res.data.publisher? "publisher not available" : typeof res.data.publisher === "string"? res.data.publisher : res.data.publisher[0],
//                 publishedAt : res.data.first_publish_year,
//                 }
//                 getAuthors(res.data)
//             })
//             .then(authordata =>  authordata)
//             .catch((error) => {
//               console.log(error);
//               return { errorMsg: `book not available ${bookId}` };
//             });
//         })
//       )
//     }

//     export async function getAuthors (book) {
//       return await Promise.all (book.authors.map(async(item) => {
//         return axios
//         .get(`https://openlibrary.org/${item.author.key}.json`)
//         .then((res) =>{
//           return res.data.name
//         }).catch((error) => {
//           console.log(error)
//           return{errorMsg:'author not available'}
//         })
//         }
//       ))
//     }



export const fetchBookById = async (id) => {
    try {
        const {data} = await axios.get(`https://openlibrary.org/works/${id}.json`)
        return data
    } catch (error) {
        console.log("cannot fetch book by id")
    }
}

export const fetchAuthorByKey = async (key) => {
    try {
        const {data} = await axios.get(`https://openlibrary.org/${key}.json`)
        return data.name
    } catch (error) {
        console.log("cannot fetch author b id")
    }
}
export const fetchBookWithAuthor = async (book) => {
  try {
    const authorKeys = await book.authors.map(array => array.author.key)
        const authors = await Promise.all(authorKeys.map(async key => await fetchAuthorByKey(key)))
        return {...book,authors}
    } catch (error) {
        console.log("cannot fetch author b id")
    }
}



