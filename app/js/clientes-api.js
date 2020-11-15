async function listarClientes(){
    return await $.get( "http://localhost:4000/listarClientes", function(data) {})
}

async function obterClientePorId(id){
    return await $.get( "http://localhost:4000/obterClientePorId/"+id, function(data) {})
}

async function cadastrarCliente(cliente){
    return await $.post( "http://localhost:4000/cadastrarCliente", cliente, function(data) {}, "json")
}

function editarCliente(cliente){
    $.ajax({
        url: 'http://localhost:4000/editarCliente',
        type: 'PUT',
        data: cliente,
        success: function(data) {
            console.log(data)
        }
    });
}

function excluirCliente(id){
    $.ajax({
        url: 'http://localhost:4000/excluirCliente/' + id,
        type: 'DELETE',
        success: function(data) {
            console.log(data)
        }
    });
}
