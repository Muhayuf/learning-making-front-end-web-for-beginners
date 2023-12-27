const READED_LIST_ID = 'readed';
const NOTREADED_LIST_ID = 'notReaded';
const BOOK_ITEMID = 'itemID';
const READED_COUNT_ID = 'readedCount';
const NOTREADED_COUNT_ID = 'notReadedCount';
let READED_COUNT = 0;
let NOTREADED_COUNT = 0;

function addBook() {

    const newTitle = document.getElementById("inputTitle").value;
    const newAuthor = document.getElementById("inputAuthor").value;
    const newYear = document.getElementById("inputYear").value;
    const newChecker = document.getElementById("inputReaded").checked;

    if(newTitle == '' || newAuthor == '' || newYear == ''){
        alert('ERROR: Harap isi semua kolom yang tersedia!');
        return;
    }
    
    document.getElementById("inputTitle").value = '';
    document.getElementById("inputAuthor").value = '';
    document.getElementById("inputYear").value = '';
    document.getElementById("inputReaded").checked = false;

    const book = makeBook(newTitle,newAuthor,newYear,newChecker);
    const bookObject = composeBookObject(newTitle,newAuthor,newYear,newChecker);

    book[BOOK_ITEMID] = bookObject.id;
    books.push(bookObject);

    let listID;
    if(newChecker){
        listID = READED_LIST_ID;
        READED_COUNT++;
    }
    else{
        listID = NOTREADED_LIST_ID;
        NOTREADED_COUNT++;
    }

    const listBook = document.getElementById(listID);

    listBook.append(book);
    updateCount()
    updateDataToStorage();
    showShelf();
}

function makeBook(newTitle,newAuthor,newYear,newChecker) {
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = newTitle;
    bookTitle.classList.add('title');

    const bookAuthor = document.createElement("p");
    bookAuthor.innerHTML = 'Penulis: <span class=\'author\'>'+newAuthor+'</span>';
    
    const bookYear = document.createElement("p");
    bookYear.innerHTML = 'Tahun: <span class=\'year\'>'+newYear+'</span>';

    const btnAction = document.createElement('div');
    btnAction.classList.add('action');

    if (!newChecker)
        btnAction.append(createReadedButton(), createDeleteButton());
    else
        btnAction.append(createUnreadedButton(), createDeleteButton());

    const container = document.createElement('div');
    container.classList.add('bookItem');

    container.append(bookTitle,bookAuthor,bookYear,btnAction);
    return container;
}

function createButton(designButton, textButton, eventListener) {
    const button = document.createElement('button');
    button.classList.add(designButton);

    button.innerHTML = textButton;

    button.addEventListener("click", function (event) {
        eventListener(event);
    });

    return button;
}

function createReadedButton() {
    return createButton('green', 'Selesai Dibaca' , function (event) {
        moveToReaded(event.target.parentElement.parentElement);
    });
}

function createUnreadedButton() {
    return createButton('green', 'Belum Selesai Dibaca' , function (event) {
        moveToUnreaded(event.target.parentElement.parentElement);
    });
}

function createDeleteButton() {
    return createButton('red', 'Hapus Buku' , function (event) {
        deleteBook(event.target.parentElement.parentElement);
    });
}

function moveToReaded(bookItem) {
    let readedStatus = confirm('Yakin ingin memindahkan buku ini ke "Selesai Dibaca"?');

    if(!readedStatus) return;

    const title = bookItem.querySelector(".title").innerText;
    const author = bookItem.querySelector(".author").innerText;
    const year = bookItem.querySelector(".year").innerText;

    const newBook = makeBook(title, author, year, true);

    const book = findBook(bookItem[BOOK_ITEMID]);
    book.isComplete = true;
    newBook[BOOK_ITEMID] = book.id;

    const listReaded = document.getElementById(READED_LIST_ID);
    listReaded.append(newBook);
    bookItem.remove();

    READED_COUNT++;
    NOTREADED_COUNT--;
    updateCount();
    updateDataToStorage();
    showShelf();
}

function moveToUnreaded(bookItem) {
    let unreadedStatus = confirm('Yakin ingin memindahkan buku ini ke "Belum Selesai Dibaca"?');

    if(!unreadedStatus) return;

    const title = bookItem.querySelector(".title").innerText;
    const author = bookItem.querySelector(".author").innerText;
    const year = bookItem.querySelector(".year").innerText;

    const newBook = makeBook(title, author, year, false);

    const book = findBook(bookItem[BOOK_ITEMID]);
    book.isComplete = false;
    newBook[BOOK_ITEMID] = book.id;

    const listNotReaded = document.getElementById(NOTREADED_LIST_ID);
    listNotReaded.append(newBook);
    bookItem.remove();
    READED_COUNT--;
    NOTREADED_COUNT++;
    updateCount();
    updateDataToStorage();
    showShelf();
}

function deleteBook(bookItem) {
    let deleteStatus = confirm('Yakin ingin menghapus buku ini?');

    if(!deleteStatus) return;

    const bookPosition = findBookIndex(bookItem[BOOK_ITEMID]);
    const bookStatus = books[bookPosition].isComplete;

    if(bookStatus){
        READED_COUNT--;
    }else{
        NOTREADED_COUNT--;
    }

    books.splice(bookPosition, 1);
    bookItem.remove();

    updateCount();
    updateDataToStorage();
    showShelf();
}

function updateCount() {
    document.getElementById(NOTREADED_COUNT_ID).innerText = NOTREADED_COUNT;
    document.getElementById(READED_COUNT_ID).innerText = READED_COUNT;
}

function showShelf() {
    const unreadedStatus = document.querySelector('.statusNotReaded');
    const readedStatus = document.querySelector('.statusReaded');

    if(NOTREADED_COUNT == 0 && unreadedStatus == null){
        const newCheckerNotReaded = document.createElement('h4');
        newCheckerNotReaded.classList.add('statusNotReaded');
        newCheckerNotReaded.innerText = 'Tidak ada buku yang belum dibaca';
        document.getElementById(NOTREADED_LIST_ID).append(newCheckerNotReaded);
    }
    
    if(NOTREADED_COUNT > 0 && unreadedStatus != null){
        unreadedStatus.remove();
    }
    
    if(READED_COUNT == 0 && readedStatus == null){
        const newCheckerReaded = document.createElement('h4');
        newCheckerReaded.classList.add('statusReaded');
        newCheckerReaded.innerText = 'Tidak ada buku yang sudah dibaca';
        document.getElementById(READED_LIST_ID).append(newCheckerReaded);
    }
    
    if(READED_COUNT > 0 && readedStatus != null){
        readedStatus.remove();
    }
}

function refreshDataFromBooks() {
    const listNotReaded = document.getElementById(NOTREADED_LIST_ID);
    const listReaded = document.getElementById(READED_LIST_ID);

    listNotReaded.innerHTML = '';
    listReaded.innerHTML = '';

    READED_COUNT = 0;
    NOTREADED_COUNT = 0;
  
    for(book of books){
        const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
        newBook[BOOK_ITEMID] = book.id;
  
        if(book.isComplete){
            READED_COUNT++;
            listReaded.append(newBook);
        } else {
            NOTREADED_COUNT++;
            listNotReaded.append(newBook);
        }
    }
    updateCount();
    showShelf();
}

function searchBook() {
    const keyword = document.getElementById('searchInput').value.toLowerCase();
    const listNotReaded = document.getElementById(NOTREADED_LIST_ID);
    let listReaded = document.getElementById(READED_LIST_ID);

    listNotReaded.innerHTML = '';
    listReaded.innerHTML = '';

    if(keyword == '') {
        refreshDataFromBooks();
        return;
    }

    READED_COUNT = 0;
    NOTREADED_COUNT = 0;

    for(book of books){[]
        if(book.title.toLowerCase().includes(keyword)){
            const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
            newBook[BOOK_ITEMID] = book.id;
      
            if(book.isComplete){
                READED_COUNT++;
                listReaded.append(newBook);
            } else {
                NOTREADED_COUNT++;
                listNotReaded.append(newBook);
            }
        }
    }
    updateCount();
    showShelf();
}