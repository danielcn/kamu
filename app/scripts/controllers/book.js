'use strict';

angular
  .module('libraryUiApp')
  .controller('BookCtrl', function($scope, $http) {

    $scope.searchCriteria = "";

    $scope.findGoogleBooks = function findGoogleBooks() {
        var searchCriteria = $scope.searchCriteria.toString();
        $scope.book = {};

        if (searchCriteria != "") {
            var endPoint = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + searchCriteria;

            $http.get(endPoint).
                success(function (data) {
                    angular.forEach(data.items, function (item) {
                        $scope.book = extractBookInformation(item.volumeInfo, searchCriteria)
                    });
               });
        }
    }

    function extractBookInformation(bookInfo, searchCriteria) {
        var targetBookIdentifier = 'ISBN_13';

        var book = {}

        angular.forEach(bookInfo.industryIdentifiers, function (isbn) {
            if (isbn.type === targetBookIdentifier && isbn.identifier === searchCriteria) {
                book = buildBook(bookInfo, isbn);
            }
        });

        return book;
    }

    function buildBook(bookInfo, isbn) {
        var book = {};

        book.title = bookInfo.title;
        book.author = bookInfo.authors;
        book.subtitle = bookInfo.subtitle;
        book.description = bookInfo.description;
        book.isbn13 = isbn.identifier;
        book.publisher = bookInfo.publisher;
        book.publicationDate = bookInfo.publishedDate;
        book.numberOfPages = bookInfo.pageCount;

        if (bookInfo.imageLinks !== undefined) {
            book.imageUrl = bookInfo.imageLinks.thumbnail;
        } else {
            book.imageUrl = "images\\no-image.png";
        }

        return book;
    }

});