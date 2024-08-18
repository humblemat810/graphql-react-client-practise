import {React, useState} from "react";
import {useQuery, useLazyQuery, useMutation, gql} from "@apollo/client"


const QUERY_ALL_MOVIES = gql`
    query GetAllMovies {
        movies {
            id
            name
            
        }
    }
`;

const QUERY_ALL_USERS = gql`
    query Users {
        users {
            name
            id
            nationality
            username
        }
    }
`;

const GET_MOVIE_BY_NAME = gql`
    query Movie($name: String!){
        movie(name: $name){
            id
            name
            yearOfPublication
        }
    }
`

const CREATE_USER_MUTATION = gql`
    mutation CreateUser($input: CreateUserInput!){
        createUser(input: $input){
            name
            id
        }
    }
`


function DisplayData(){
    const [createUser] = useMutation(CREATE_USER_MUTATION)
    const [movieSearching, setMovieSearching] = useState("")
    const [fetchMovie, {data: moveSearchData, error: movieError}] = useLazyQuery(GET_MOVIE_BY_NAME)
    const {data, loading, refetch, error} = useQuery(QUERY_ALL_USERS);
    const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
    const [name, setName] = useState("")
    const [age, setAge] = useState(0)
    const [username, setUsername] = useState("")
    const [nationality, setNationality] = useState("")

    console.log("QUERY_ALL_MOVIES")
    console.log(QUERY_ALL_MOVIES)
    if (movieData) {
        console.log(movieData)
    }
    
    
    if (data) {
        console.log(data)
    }
    console.log("data done")
    if (loading){
        return <h1>loading data... please wait...</h1>
    }
    return(
        <div>
            <div>
                    <input type="text" 
                        placeholder="Name..."
                        onChange={(event) => setName(event.target.value)}></input>
                    <input type="text" 
                        placeholder="Username..."
                        onChange={(event) => setUsername(event.target.value)}></input>
                    <input type="number" 
                        placeholder="Age..."
                        onChange={(event) => setAge(Number(event.target.value))}></input>
                    <input type="text" 
                        placeholder="Nationality..."
                        onChange={(event) => setNationality(event.target.value.toUpperCase())}></input>
                    <button onClick={()=>{
                        
                        createUser({
                            variables: {input: {name, username, age, nationality}}
                        });
                        refetch();
                    }}>Create User</button>
                </div>
            {data &&
                data.users.map ((user) => {
                    return (
                        <div key={user.id}>
                            <h1>Name: {user.name}</h1>
                        </div>
                    );
                })
            }

            {movieData &&
                movieData.movies.map ((movie) => {
                    return (
                        <div key={movie.id}>
                            <h1>MovieName: {movie.name}</h1>
                        </div>
                    );
                })
            }
            <div>
                
                <input type="text" 
                        placeholder="Interstellar"
                        onChange={(event) => setMovieSearching(event.target.value)}></input>
                <button onClick={()=>{
                    fetchMovie({
                        variables: {
                        name: movieSearching,
                    },
                });
                }}>
                        {" "}
                        Fetch data
                </button>
                <div>
                    
                    {(movieError)? 
                        <div>no such movie</div>
                    :(moveSearchData && (
                        <div>
                            {" "}
                            <h1>MovieName:{moveSearchData.movie.name}</h1>
                            <h1>Year Of Publication:{moveSearchData.movie.yearOfPublication}</h1>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DisplayData;