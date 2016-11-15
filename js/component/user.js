/**
 * Created by ASSOON on 2016/11/6.
 */
define(['bootstrap', 'avalon', 'jstree', 'jquery_select', 'sweet_alert', 'featurepack'], function (bootstrap, avalon, jstree, jquery_select, swal, featurepack) {
    var dataUrl, overallSituation;

    var cloudMail = {
        initSlect: function () {
            $('.selectdept').select({
                url: '',
                multiple: true,
                //获取下拉jstree
                jstree: {
                    'url': 'json/datatree.json'
                }
            });

            $('.data_tree').jstree({
                "plugins": ["wholerow", "types", "contextmenu"],
                'core': {
                    "check_callback": true,
                    'data': {
                        "url": "json/datatree.json",
                        "dataType": "json" // needed only if you do not supply JSON headers
                    }
                },
                "types": {
                    "default": {
                        "icon": "fa fa-folder"
                    }
                },
                "contextmenu": {
                    "items": {
                        addPerson: {
                            label: "新增成员",
                            action: function (node) {
                                $('#showBigBox').click();
                                $('.loginname').removeAttr('readonly','readonly')
                            },
                            "separator_after": true
                        },
                        createItem: {
                            label: "添加部门",
                            action: function (node) {
                                console.log(node);
                                $('#showSmallbox').click();
                            }
                        },
                        renameItem: {
                            label: "修改名称",
                            action: function (node) {
                                $('#showSmallbox').click();
                            }
                        },
                        deleteItem: {
                            label: "删除",
                            action: function (node) {
                                swal({
                                        title: "Are you sure?",
                                        text: "You will not be able to recover this imaginary file!",
                                        type: "warning",
                                        showCancelButton: true,
                                        confirmButtonColor: "#DD6B55",
                                        confirmButtonText: "Yes, delete it!",
                                        closeOnConfirm: false
                                    },
                                    function () {
                                        swal("Deleted!", "Your imaginary file has been deleted.", "success");
                                    });
                            },
                            "separator_after": true
                        }
                    }

                }

            })
                .on("changed.jstree", function (e, data) {
                    console.info(data.node.id);
                })
                .on('open_node.jstree', function (e, data) {
                    console.info(e);
                    console.info(data.node);
                });
        },
        getResponse: function (postdata) {
            featurepack.pack.ajax(dataUrl.getUserListUrl, "get", postdata, function (result) {
                if (result.code == 0) {
                    overallSituation.userList = result.data;
                    console.log(overallSituation.userList)
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        deletePeople: function (postdata) {
            featurepack.pack.ajax(dataUrl.deletePeopleUrl, "get", postdata, function (result) {
                if (result.code == 0) {
                    swal("删除成功!", "您已经删除选择的人员，点击OK关闭窗口。", "success");
                    console.info(postdata)
                } else {
                    swal(result.msg, "", "error");
                }
            })
        },
        avalonStart: function () {
            overallSituation = avalon.define({
                $id: "userlist",
                // //-----------
                // deptid:"",
                // email:"",
                // id:"",
                // loginname:"",
                // mobile:"",
                // name:"",
                // qwer:"",
                // position:"",
                // sex:"",
                // userid:"",
                // //-----------
                //填充数据上面的上面的不要
                filldata:{},
                userList: [],
                select: [],
                editTree: function (el) {
                    overallSituation.filldata = el;
                        $('.loginname').attr('readonly','readonly');
                        $('.selectdept').select('setSelected', el.depts);
                        $('#showBigBox').click();
                },
                deleteSelect: function () {
                    overallSituation.select.length == 0 ? swal("出错啦！", "您当前没有选择删除的内容。", "error") : (function () {
                        swal({
                                title: "确定删除选中的人员?",
                                text: "删除以后将不会恢复!",
                                type: "warning",
                                showCancelButton: true,
                                cancelButtonText:"取消",
                                confirmButtonColor: "#DD6B55",
                                confirmButtonText: "确定",
                                closeOnConfirm: false
                            },
                            function(){
                                cloudMail.deletePeople({ids:overallSituation.select});
                            });
                    })()
                },
                choiceAll: function (e) {
                    if ($(e.target).attr('data') == 0 && $(e.target).text() == '全部选中') {
                            $(e.target).text('取消全选');
                            $(e.target).attr('data', 1);
                                for (var i = 0; i < overallSituation.userList.length; i++) {
                                    overallSituation.select.push(overallSituation.userList[i].id.toString())
                                }
                    } else if ($(e.target).attr('data') == 1 && $(e.target).text() == '取消全选') {
                            $(e.target).text('全部选中');
                            $(e.target).attr('data', 0);
                                    overallSituation.select = [];
                    }
                },
                validate: {
                    onError: function (reasons) {
                        reasons.forEach(function (reason) {
                            console.log(reason.getMessage())
                        })
                    },
                    onValidateAll: function (reasons) {
                            console.log(reasons);
                            console.log("没有通过");
                    },
                    validateInBlur:true,
                    validateInKeyup:true
                },
                choice: function (e) {
                    $(e.target).children('input').attr({'selected': 'selected'})
                }
            });

            avalon.scan(document.body)
        }
    };

    var initStart = function (url) {
        dataUrl = url;
        //放大表格
        featurepack.pack.expand();
        cloudMail.initSlect();
        cloudMail.avalonStart();
        cloudMail.getResponse();
    };

    return {
        init_start: initStart
    };
});