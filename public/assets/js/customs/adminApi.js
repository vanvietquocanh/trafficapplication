"use strict";
// css 
$("#sidebar-menu>ul>li>a.waves-effect:first").addClass('active');
$(".checkbox-person").css({
    "position":"absolute",
    "top" : "40%",
    "right" : "1%"
})

// api
var api = new API();
var updateDB = $("#updateDB");
var search = $("#search");
var renderMember = $("#renderAPIdata");
var promote = $("#promote");
var demote = $("#demote");
var dismissal = $("#dismissal");
var memberMasterList = $("#memberMasterList");
var select = [];
var countRequest = 0;
var indexOfNetWorkEdit;
var arraySelectMember=[];
//this is variable netWOrk
var nameNetwork = $("#nameNetwork");
var methodNetwork = $("#methodNetwork");
var linkNetwork = $("#linkNetwork");
var postBack = $("#postBack");
var addBtnNetwork = $("#btnAddNetWork");
var renderNetwork = $("#renderNetwork");
function API() {
	this.data;
	this.member;
}
API.prototype.fil = function(select, condition) {
	var result = select.filter(function(item) {
				return item.id === condition;
			});
	return result;
}
API.prototype.attachedNewMember = function(data) {
	$("#renderManagerAPI").empty();
	var itemHTML = `<h3>Confirm</h3>`;
	$.each(data,(index, el) =>{
		itemHTML += `<label for="${el.idFacebook}" style="width:100%">
				            <a>
				                <div class="inbox-item" style="display:flex; position: relative; border-bottom: 1px solid #777; padding-bottom: .5em">
				                    <div class="inbox-item-img"><img src="${el.profile.photos[0].value}" class="img-circle" alt="${el.profile.displayName}-image"></div>
				                    <p class="inbox-item-author" style="padding-left:1em; padding-top:1em; color:#fff">${el.profile.displayName}</p>
				                    <p class="inbox-item-date" style="position:absolute; right: 10%; top: 20%; color:#fff">${el.timeregis}</p>
				                    <input class="checkbox-person noMember" type="checkbox" name="sel" id="${el.idFacebook}" value="${el.idFacebook}" style="position:absolute; right: 3%; top: 50%;">
				                </div>
				            </a>
				        </label>`;
	    $("#renderManagerAPI").append(itemHTML)
	})
	$(".noMember").change(function(event) {
		if(event.target.checked){
			var member = {
				"mem" : event.target.checked,
				"id"  : event.target.value
			}
			if(api.fil(select, event.target.value).length === 0){
				select.push(member)
			}
		}else{
			$.each(select, function(index, val) {
				if(val){
					if(val.id === event.target.value){
						select.splice(index,1);
					}
				}
			});
		}
	});
	api.saveData(data);
}
API.prototype.requestSave = function(data){
	console.log(data)
	$.each(data,(i,person)=>{
		$.post("/savedata",person,function(data, textStatus, xhr){
			console.log(data)
		})
		if(i===data.length-1){
			window.location.reload(true);
		}
	})
};
API.prototype.getAPIManager = function(){
	$.post('/apiAwaitingApproval', function(data, textStatus, xhr) {
		this.data = data;
		api.attachedNewMember(this.data)
	});
};
API.prototype.attachedMember = function(data){
	var htmlAttached = "";
	$.each(data, function(index, el) {
		htmlAttached += `<label for="${el.idFacebook}" style="width:100%">
                            <a>
                                <div class="inbox-item">
                                    <div class="inbox-item-img"><img src="${el.profile.photos[0].value}" class="img-circle" alt="img-${el.profile.displayName}"></div>
                                    <p class="inbox-item-author" style="line-height: 3">${el.profile.displayName}</p>
                                    <p class="inbox-item-date">${el.sessionTime}</p>
                                    <input class="checkbox-person isMember" type="checkbox" name="${el.idFacebook}" id="${el.idFacebook}" value="${el.idFacebook}" style="position: absolute; right: 2%; top: 60%;"/>
                                </div>
                            </a>
                        </label>`;

	});
	renderMember.append(htmlAttached)
	$(".isMember").change(function(event) {
		if(event.target.checked){
			var member = {
				"master" : event.target.checked,
				"id"     : event.target.value
			}
			if(api.fil(arraySelectMember, event.target.value).length === 0){
				arraySelectMember.push(member)
			}
		}else{
			$.each(arraySelectMember, function(index, val) {
				if(val){
					if(val.id === event.target.value){
						arraySelectMember.splice(index,1);
					}
				}
			});
		}
	});
	$("#promote").click(()=>{
		let sessionPromote = confirm("You sure you want Promote?")
		if(sessionPromote&&arraySelectMember.length>0){
			$.each(arraySelectMember,(i,person)=>{
				$.post("/promote", person, (data, textStatus, xhr)=>{
					console.log(data)
				})
				if(i===arraySelectMember.length-1){
					window.location.reload(true);
				}
			})
		}
	});
	$("#demote").click(()=>{
		let sessionDemote = confirm("You sure you want Demote?")
		if(sessionDemote&&arraySelectMember.length>0){
			$.each(arraySelectMember,(i,person)=>{
				$.post("/demote", person, (data, textStatus, xhr)=>{
				})
				if(i===arraySelectMember.length-1){
					window.location.reload(true);
				}
			})
		}
	});
	$("#dismissal").click(()=>{
		let sessionDismissal = confirm("You sure you want Dismissal?")
		if(sessionDismissal&&arraySelectMember.length>0){
			$.each(arraySelectMember,(i,person)=>{
				$.post("/dismissal", person, (data, textStatus, xhr)=>{
				})
				if(i===arraySelectMember.length-1){
					window.location.reload(true);
				}
			})
		}
	});
	memberMasterList.click(function(event) {
		renderMember.empty();
		if(memberMasterList.children().text()==="Member List"){
			arraySelectMember = [];
		console.log(memberMasterList.children().text())
			api.getAPIMember()
			$("#memListTit").html("Member List");
			memberMasterList.children().html("Master List")
		}else{
			arraySelectMember = [];
		console.log(memberMasterList.children().text())
			api.getMaster()
			$("#memListTit").html("Master List");
			memberMasterList.children().html("Member List")
		}
		memberMasterList.unbind();
	});
};
API.prototype.getMaster = ()=>{
	$.post('/getmasterlist', function(data, textStatus, xhr) {
		api.attachedMember(data);
	});
}
API.prototype.getAPIMember = function(){
	$.post('/member', function(data, textStatus, xhr) {
		this.member = data;
		api.attachedMember(data);
	});
};
API.prototype.saveData = function(data){
	updateDB.click(function(event) {
		var session = confirm("You sure you want to add this member ?")
		if(session&&select.length>0){
			api.requestSave(select);
		}
	});
};
API.prototype.addNetwork = (dataInput)=>{
	$.post("/addnetwork",dataInput,(data, text, xhr)=> {
		if(data){
			api.attachedNetworkToDom(dataInput)
		}
	})
}
API.prototype.getNetworkList = function(){
	$.post('/listnetwork', function(data, textStatus, xhr) {
		api.setNetwork(data);
		renderNetwork.empty();
		data.NetworkList.forEach((val, index)=>{
			api.attachedNetworkToDom(val, index)
		})
		api.addEventEditer();
	});
};
API.prototype.addEventEditer = function(){
	var netWorkData = this.netWork;
	$(".btn-content-del").click(function(event) {
		netWorkData.NetworkList.splice($(event.target).attr("class").split("btn_")[1],1)
		api.rerenderNetwork();
	});
	$(".btn-content-edit").click((event)=>{
		$.each(netWorkData.NetworkList, (index, el)=> {
			if(index == $(event.target).attr("class").split("btn_")[1]){
				indexOfNetWorkEdit = index;
				nameNetwork.val(el.name)
				methodNetwork.val(el.method)
				linkNetwork.val(el.link)
				postBack.val(el.postback)
				addBtnNetwork.children().removeClass("fa-plus").addClass('fa-check');
			}
		});
	})
};
API.prototype.setNetwork = function(data){
	this.netWork = data;
};
API.prototype.attachedNetworkToDom = (data, index)=>{
	var htmlNetWork =  `<tr role="row" class="odd">
					        <td>${data.name}</td>
					        <td>${data.method}</td>
					        <td>${data.link}</td>
					        <td>http://128.199163.213:3000/eventdata?transaction_id=${data.postback}</td>
					        <td class="icon-content"><button class="btn-content btn-content-edit fa btn_${index}"></button></td>
					        <td class="icon-content"><button class="btn-content btn-content-del fa btn_${index}"></button></td>
						</tr>`;
	renderNetwork.append(htmlNetWork);
}
api.getNetworkList();
search.change(function(event) {
	console.log(search.val())
});
api.getAPIManager();
api.getAPIMember();
$("#refreshAPI").click(function(event) {
	var sessionRefresh = confirm("You definitely want to freshen up the offers?");
	if(sessionRefresh&&countRequest===0){
		countRequest++;
		$.post('/autorequestlink', null, function(data, textStatus, xhr) {
			var readAlert = alert(data);
		});
	}
});
API.prototype.rerenderNetwork = function(){
	$.post("/updatenetwork", api.netWork, (data, text, xhr)=>{
		renderNetwork.empty()
		if(data){
			$.each(api.netWork.NetworkList, function(index, val) {
				$(".btn-content-del").unbind('click');
				$(".btn-content-edit").unbind('click');
				api.attachedNetworkToDom(val,index);
				api.addEventEditer();
			});
		}
	})
};
addBtnNetwork.click(function(e) {
	if(addBtnNetwork.children().attr("class").split("-")[1]==="plus"){
		// if(methodNetwork.val()){
		// 	$.post(linkNetwork.val(), function(data, textStatus, xhr) {
		// 		if(xhr.status===200){
		// 			attachedNetwork();
		// 		}else{
		// 			alert("Link Error!")
		// 		}
		// 	});
		// }else{
		// 	$.get(linkNetwork.val(), function(data, textStatus, xhr){
		// 		if(xhr.status===200){
		// 			attachedNetwork();
		// 		}else{
		// 			alert("Link Error!")
		// 		}
		// 	});
		// }
		// function attachedNetwork() {
			if(nameNetwork.val()!=="" &&methodNetwork.val()!== null&&linkNetwork.val()!==""&&postBack.val()!==""){
				var domainNetwork = linkNetwork.val().split("://")[1].split(".")[0];
				if(domainNetwork){
					var data = {
						name     : nameNetwork.val(),
						method   : methodNetwork.val(),
						link     : linkNetwork.val(),
						postback : postBack.val()
					}
					api.addNetwork(data)
				}
			}else {
				alert("Please enter full information!!");
			}
		// }
	}else{
		var itemEdit = api.netWork.NetworkList[indexOfNetWorkEdit];
		itemEdit.name = nameNetwork.val();
		itemEdit.method = methodNetwork.val();
		itemEdit.link = linkNetwork.val()
		itemEdit.postback = postBack.val()
		addBtnNetwork.children().removeClass("fa-check").addClass('fa-plus');
		nameNetwork.val("")
		methodNetwork.val("")
		linkNetwork.val("")
		postBack.val("")
		api.rerenderNetwork()
	}
});
