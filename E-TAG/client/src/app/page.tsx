'use client';

import React, { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios';


type BookType = {
    id: string;
    title: string;
    summary: string;
    eTag: string;
}
const Home = () => {

    const [user, setUser] = useState<number>(0);
    const [book, setBook] = useState<BookType | null>(null);

    const getBook = async () => {
        try {
            const response = await axios.get(
                'http://localhost:3001/books/1',
                {
                    headers: book?.eTag ? { 'if-none-match': book?.eTag } : {},
                }
            );

            if (response.status === 200) {
                // If a 200 response is returned, update the summary and store the new ETag
                setBook(response.data);
            }
        }
        catch (error: any) {
            if (error.response && error.response.status === 304) {
                console.log('Summary has not changed. Using cached version.');
            } else {
                console.error('Error fetching the summary', error);
            }
        }
    }

    const updateSummary = async () => {
        const res = await axios.put(
            'http://localhost:3001/books/1',
            { summary: book?.summary },
            { headers: { 'if-match': book?.eTag } }
        );
        setBook(res.data);
        console.log(res.data);
    }

    useEffect(() => {
        setUser(Math.floor(Math.random() * 2));
    }, [])


    return (
        <div className='m-2'>
            <div className="flex justify-center border-2">
                <p className="text-black text-3xl">User - {user}</p>
            </div>
            <div className='my-4'>
                <button className='bg-blue-400 shadow-lg w-fit p-2 text-white rounded-md' onClick={() => getBook()}>Get Book with ID=1</button>
            </div>

            <div className='mt-10 border-2 p-6'>
                <h1 className="text-2xl mb-3">Books</h1>

                {
                    book && (
                        <div className='shadow-lg flex-col w-1/2 justify-center gap-16 border-2 p-4'>
                            <p className=' font-semibold '>Title :- <span className='text-blue-600' >{book.title}</span></p>
                            <p className='font-semibold '>Summary</p>
                            <textarea className='text-red-500 border-2 border-blue-500 w-full h-fit' value={book.summary} onChange={(e) => setBook({ ...book, summary: e.target.value })} /><br />
                            <button className='bg-blue-400 shadow-lg w-fit p-2 text-white mt-4' onClick={() => updateSummary()}>Change Summary</button>
                        </div>
                    )
                }
            </div>

        </div>
    )
}

export default Home