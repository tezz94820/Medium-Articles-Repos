const express = require("express");
const cors = require("cors");
const crypto = require('crypto');

//express app
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


//collection of Books 
const books = [
    { id: '1', title: 'Harry Potter', summary: 'This is Summary of Book Harry Potter.', eTag: '7fc73b54f4d48332104f2ca70450daf8a0ff086ca0c2ebc5c8153596b0644581' }
];

// Function to generate ETag based on the summary
function generateETag(summary) {
    return crypto.createHash('sha256').update(summary, 'utf8').digest('hex');
}


// Get a book by ID
app.get("/books/:book_id", (req, res) => {
    // find the book from the db.
    const book = books.find(book => book.id === req.params.book_id);
    //if book is not found then return 404.
    if (!book) {
        return res.status(404).json({ error: "No Book Found" });
    }

    if (!book.eTag) {
        // Generate ETag only if it doesn't exist
        book.eTag = generateETag(book.summary);
    }
    //setting Header ETag in response
    res.setHeader("ETag", book.eTag);
    //returning the response
    console.log(books);
    return res.status(200).json(book);
});


// Update book summary if ETag matches
app.put("/books/:book_id", (req, res) => {
    // find the book from the books collection.
    const book = books.find(book => book.id === req.params.book_id);
    //if book is not found then return 404.
    if (!book) {
        return res.status(404).json({ error: "No Book Found" });
    }

    // Extract the If-Match header
    const clientETag = req.headers['if-match'];
    // Generate the current ETag of the book
    const serverETag = book.eTag;

    // if both client etag and server etag don't match then return 412
    if (clientETag != serverETag) {
        return res.status(412).json({ error: 'Precondition Failed: The book has been updated by another user.' });
    }

    // Update the book summary and eTag field
    books.forEach(book => {
        //update the summary
        book.summary = req.body.summary;
        book.eTag = generateETag(req.body.summary);
    });

    //updated book details
    const updatedBook = books.find(book => book.id === req.params.book_id);
    //set eTag of updated book.
    res.setHeader('ETag', updatedBook.eTag);
    //return the response.
    return res.status(200).json(book);
});

//create a http server
app.listen(3001, () => {
    console.log("Server started on port 3000");
});