document.addEventListener('DOMContentLoaded', function () {

    const addForm = document.getElementById('addForm');
    const searchForm = document.getElementById('searchForm');

    addForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        searchBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener('ondataloaded', () => {
    refreshDataFromBooks();
});