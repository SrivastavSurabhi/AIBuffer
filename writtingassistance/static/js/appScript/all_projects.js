$(document).ready(function(){

    initializeProjectDataTable();
  
    $(document).on("click",'.delete_project  .delete', function(){
        projectId = $("#deleteData").attr('data');
        $.ajax({
            type: "DELETE",
            headers: {'X-CSRFToken': token},
            url: urls.deleteProject,
            data: projectId,
            processData: false,
            contentType: false,
            beforeSend: function() {
                showLoader();
            },
            complete: function() {
                hideLoader();
            },         
            success:function() {
                TaskTable.draw();
            },
            error: function() {
                alert("Something went wrong. Please try again.");
            },  
        });
    }); 
})


function initializeProjectDataTable()
{
    var projectDataTableProps = {
        order: [[0, "desc"]],        
        columns: [
            {
                data: null,
                render: function(data, type, full, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }                   
            },
            {
                data: 'name',
                searchable: true,
            },
            {
                data: 'created_date',
                searchable: true,
            },
            {
                data: 'id',
                searchable: false,
                orderable: false,
                "render": function(data,type,full,meta) { 
                    html = `<div class="button-wrap"><a type="button" class="btn btn-success" href="/projects/project_detail/${data}"><i class="fas fa-eye"></i></a>`
                    html +=`<a type="button" id="${data}"class="btn btn-danger delete_projects" `
                    html += `onclick="showDeleteModal('${data}','${full.name}','delete_project')" >`
                    html += `<i class="fas fa-trash-alt"></i></a></div>`
                    return html
                }
            },            
        ],
        ajax: dataTableUrls.projectDataTableUrl,
    }
      // Merge Table options With constant data
      var FinalTableOptions = $.extend(basicDataTableProperties, projectDataTableProps);
      TaskTable = $('#projects').DataTable(FinalTableOptions);
}

