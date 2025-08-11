# AngularApp2
Second Angular Assignment- Reservations with a Database
Action Items Testing and Results:
* Add reservation - works as intended - adds the reservation to the table and the database. Image upload failing- uses placeholder image.
* Edit reservation - works as intended - updates the reservation in the table and the database. Image uploading still not working.
* Cancel ADD reservation - works as intended - does not add reservation and redirects back to table.
* Cancel EDIT reservation - works as intended - does not edit any informationm in the reservation and redirects back to the table.
* Delete reservation- works as intended - provides a confirmation mnessage - if user selects "OK" removes the reservation from the table and the database. If the user clicks "Cancel" it does not remove the reservation and redirects back to the table. 
* About Us- works as intended - redirects user to seperate page with simple About information. 

Assignment 6 Debugging:
* Login - Have a uyser hard-coded and in the "employees" table - Works as intended, hard-coding user adds them to the table in MyPHP.
* Login - Input the hard-coded employee number and password, click submit then redirect to the reservation list- Works as intended.
* Register new employee - Button redirects to registration form - works as intended. Adding a duplicate employee number returns message "Employee number alreadyt exists" - works as intended.
* Log-out button on reservation list page- redirects to login page - works as intended. 
* Lock-out time for incorrect login attempts - 