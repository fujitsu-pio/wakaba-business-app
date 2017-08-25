var sm = {};
sm.notImage = "https://demo.personium.io/HomeApplication/__/icons/no_app_image.png";
sm.imgBinaryFile = null;
sendCount = 0;

additionalCallback = function() {
    // display survey info
    $(function () {
        var filter = "";
        // initialization of image file
        $("#idImgFile").attr('src', sm.notImage);
        Common.dispUserName(Common.cellUrl);

        var messageBody = sessionStorage.getItem("MessageBody");
        var body = JSON.parse(messageBody);
        var title = body.Title;
        var pBody = body.Body.replace( /"\"/g ,"" );
        pBody = pBody.substr( 1 );
        pBody = pBody.substr( 0, pBody.length-1 );
        pBody = JSON.parse(pBody);

        var message = pBody.Body;
        var purpose = pBody.Text;
        var dataType = pBody.Type;
        var sexs = pBody.SearchSex.split(",");
        var ages = pBody.SearchAge.split(",");
        var areas = pBody.SearchArea;
        var sendCount = pBody.sendCount;
        var imgUrl = pBody.ImgUrl;
        var termStart = pBody.TermStart.replace( /\//g,"-" );
        var termEnd = pBody.TermEnd.replace( /\//g,"-" );
        sessionStorage.setItem("TermEnd", termEnd);

        switch (dataType) {
        case "1":
            var url = 'https://demo.personium.io/hn-ll/io_personium_demo_hn-ll-app/OData/User?$inlinecount=allpages&$top=10000&$filter=substringof(%27hn-app-genki%27,Services)';
            $("#target").attr("data-i18n", "glossary:nutritionData").localize();
            $("#targetItem").attr("data-i18n", "glossary:pdsCalorieSmile").localize();
            $("#targetData")
                .attr("data-i18n", "glossary:survey.targetData.calorieSmile")
                .localize();
            break;
        case "2":
            var url = 'https://demo.personium.io/hn-ll/io_personium_demo_hn-ll-app/OData/User?$inlinecount=allpages&$top=10000&$filter=substringof(%27hn-app-neurosky%27,Services)';
            $("#target")
                .attr("data-i18n", "glossary:pdsLifeBeat")
                .localize();
            $("#targetItem")
                .attr("data-i18n", "glossary:pdsLifeBeat")
                .localize();
            $("#targetData")
                .attr("data-i18n", "glossary:survey.targetData.lifeBeat")
                .localize();
            break;
        default:
            var url = 'https://demo.personium.io/hn-ll/io_personium_demo_hn-ll-app/OData/User?$inlinecount=allpages&$top=10000&$filter=substringof(%27hn-app-genki%27,Services)';
            $("#target").attr("data-i18n", "glossary:nutritionData").localize();
            $("#targetItem").attr("data-i18n", "glossary:pdsCalorieSmile").localize();
            $("#targetData")
                .attr("data-i18n", "glossary:survey.targetData.calorieSmile")
                .localize();
            break;
        }

      $("#targetNumberOfPeople").html(sendCount);
      $("#targetArea").html(areas);

      $("#iMassageTitle").attr("value",title);
      $("#iMassageBody").html(message);
      $("#iPurpose").html(purpose);
      $('#termStart').attr("value",termStart);
      $('#termEnd').attr("value",termEnd);

      var dispSex = "";
      for (var i in sexs) {
        if (i > 0) dispSex += ",";
        switch (sexs[i]) {
          case "1":
            dispSex += i18next.t("candidateFilter:gender.options.male");
            break;
          case "2":
            dispSex += i18next.t("candidateFilter:gender.options.female");
            break;
        }
      }
      $("#targetSex").html(dispSex);

      var dispAge = "";
      for (var i in ages) {
        var age = ages[i];
        if (i > 0) {
          dispAge += ",";
        }
        if (age < 100) {
          dispAge += age + "代";
        } else {
          dispAge += age + "歳以上";
        }
      }
      $("#targetAge").html(dispAge);

      if (imgUrl != null) {
        var fileName = imgUrl.split('/')[0]
        $("#imageName").html(sessionStorage.getItem("ImageFileName"));
        $('#image').attr("src",imgUrl);
				sessionStorage.setItem("ImageSrc", imgUrl);
      } else {
        $("#imageName").html("No Image");
        $('#image').attr("src","https://demo.personium.io/HomeApplication/__/icons/no_app_image.png");
      }

  //入力内容を取得して、対象のセルにメッセージを送信する
  $('#b-send-message').on('click', function() {
    sendMessage();
  });

  function sendMessage() {
    cellUrl = Common.cellUrl;
    sendMessageUrl = cellUrl + "__message/send";
    sendTo = sessionStorage.getItem("SendToCell");
    token = Common.token;
    var name = "ShokujiViewer";
    if (dataType !== "1") {
      name = "StressViewer"
    }

    $.ajax({
      type: 'POST',
      url: sendMessageUrl,
      dataType: 'json',
      headers: {'Authorization': 'Bearer ' + token,'Accept': 'application/json'},
      data: messageBody
    }).done(function(response){
      console.log(response);
      var j = 0
      for (var i = 0 ; i < response.d.results.Result.length ; i ++) {
        if ( response.d.results.Result[i].Code == "201" ) {
          j = j + 1 ;
        }
      }

      if ( response.d.results.Result.length == j ) {
        sessionStorage.removeItem("ImageSrc");
        sessionStorage.removeItem("TermEnd");
        location.href = "./sendMessageResult.html";
      } else {
        alert( response.d.results.Result.length + "件中 " + j + "件の送信に成功しました\n" +
      　　　　　response.d.results.Result.length + "件中 " + ( response.d.results.Result.length - j ) + "件の送信に失敗しました" );
      	history.back();
      }
    }).fail(function(response){
      console.log(response);
      alert("メッセージの送信に失敗しました");
      history.back();
    });
	
  }

 });
};
