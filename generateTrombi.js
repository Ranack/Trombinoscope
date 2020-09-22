function generateDoc() {
  var style = {};
    style[DocumentApp.Attribute.FONT_FAMILY] = 'Calibri';
    style[DocumentApp.Attribute.FONT_SIZE] = 14;
    style[DocumentApp.Attribute.BOLD] = true;
  var optionalArgs = {
    pageSize: 0
  };
  var response = Classroom.Courses.list(optionalArgs);
  var courses = response.courses;
  if (courses && courses.length > 0) {
    for (i = 0; i < courses.length; i++) {
      var course = courses[i];
      var responseStudent = Classroom.Courses.Students.list(course.id);
      var students = responseStudent.students;
      if(students && students.length > 0){
        var doc = DocumentApp.create("Trombinoscope " + course.name)
        var fileId = '1_YCxlhUtOaIx5HmPUIlg_SjolbugXazl'; //penser à changer l'id du fichier image stocké sur le drive pour avoir le logo
        var img = DriveApp.getFileById(fileId).getBlob();
        var img = doc.getChild(0).asParagraph().appendInlineImage(img)
        img.setWidth(275)
        img.setHeight(90)
        var space = doc.appendParagraph(" ");
        var par = doc.getChild(0).asParagraph();
        var title = doc.appendParagraph("TROMBINOSCOPE ANNÉE 2020-2021,\n");
        title.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);           
        var classe = title.appendText(course.name);
        var space = doc.appendParagraph(" ");
        var paraStyle = {};
         paraStyle[DocumentApp.Attribute.SPACING_AFTER] = 0;
         paraStyle[DocumentApp.Attribute.LINE_SPACING] = 1;
       var body = doc.getBody();
       var table = body.appendTable().setBorderWidth(0);;
        for(var z=0; z<1; z++){
          var tr = table.appendTableRow();
          var x = 0
          var y = 0
            for( a=0; a < students.length; a++){
               var pic = Classroom.Courses.Students.photoUrl 
               var student = students[a];
               var photoUrl = student.profile.photoUrl
                if (photoUrl.substring(0,4) != "http") {
                    photoUrl = "https:" + photoUrl; 
                    }
               var studentName = student.profile.name.fullName.substring(0);
                if (x <4){
                   var td = tr.appendTableCell(studentName);
                   var resp = UrlFetchApp.fetch(photoUrl);
                   var profilePic = table.getCell(y, x).insertImage(0, resp);
                   profilePic.setWidth(90)
                   profilePic.setHeight(120)
                   x++;
                   //Impossible de centrer le nom des étudiants, GAP ne permets pas le centrage dans les cells d'une table (https://issuetracker.google.com/issues/36765133)
                   }
              else{
                  var tr = table.appendTableRow();
                  var x = 0
                  y++;
                  }
             }    
         }
      doc.saveAndClose()    
    var docId = doc.getId();
    var docFolder = DriveApp.getFileById(docId).getParents().next().getId();
    var docblob = doc.getAs('application/pdf');
    docblob.setName(doc.getName() + ".pdf");
    var file = DriveApp.createFile(docblob);
    var fileId = file.getId();
    var fileURL = file.getUrl(); 
    Logger.log("pdf done "+ fileURL)
    }   
    }
  }
  else {
  Logger.log(course.name, course.id, '=> Erreur: aucun etudiant dans cette classe. Trombinoscope abandonné !');
  }
}
