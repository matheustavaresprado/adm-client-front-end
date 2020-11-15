$(document).ready(function(){
    carregarClientes()
    carregarConfigsModal()
    carregarBuscaTabela()
})

function carregarClientes(){
    listarClientes().then((dados) => {
        preencheTbody(dados)
    })
}

function preencheTbody(dados){
    var tbody = $('#clientes')
    tbody.html('')

    $.each(dados, function (key, item) {
        tbody.append(gerarHtml(item))
    });
}

function gerarHtml(item){
    return ""
    + "<tr>"
    + "<td>" + item.nome + "</td>"
    + "<td> R$ " + item.renda_familiar.replace('.', ',') + "</td>"
    + "<td>"
    +   '<button type="button" class="btn btn-sm btn-primary btn-outline btn-1b" onclick="abrirModalCliente(' + item.id + ')" data-tooltip="tooltip" title="Editar" data-toggle="modal" data-target="#manterCliente" data-whatever="Editar cliente"><i class="fas fa-pencil-alt"></i></button>'
    +   '<button type="button" class="btn btn-sm btn-danger btn-outline btn-1b ml-1" onclick="excluir(' + item.id + ')" data-tooltip="tooltip" title="Excluir"><i class="fas fa-trash-alt"></i></i></button>'
    + "</td>"
    + "</tr>"
}

function salvar(){
    if($('#id').val()){
        editarCliente($('#formCliente').serialize()).then((dados) => {
            if(dados.code == 'erro')alert(dados.message)
        })
    }
    else{
        cadastrarCliente($('#formCliente').serialize()).then((dados) => {
            if(dados.code == 'erro')alert(dados.message)
        })
    }
}

function excluir(id){
    excluirCliente(id)
}

function abrirModalCliente(id){
    obterClientePorId(id).then((dados) => {
        preencheCamposModal(dados[0])
    })
}

function preencheCamposModal(dados){
    $('#id').val(dados.id)
    $('#nome').val(dados.nome)
    $('#cpf').val(dados.cpf)
    $('#dt_nascimento').val(dados.dt_nascimento.slice(0, 10))
    $('#dt_cadastro').val(dados.dt_cadastro.slice(0, 10))
    $('#renda_familiar').val(dados.renda_familiar)
}

function limparCamposModal(){
    $('#id').val('')
    $('#nome').val('')
    $('#cpf').val('')
    $('#dt_nascimento').val('')
    $('#dt_cadastro').val('')
    $('#renda_familiar').val('')
}


function mostrarDashboard(){
    $('#paginaInicial').show()
    $('#ControleClientes').hide()
}

function mostrarControleClientes(){
    $('#paginaInicial').hide()
    $('#ControleClientes').show()
    $('[data-tooltip="tooltip"]').tooltip()
}

function carregarConfigsModal(){
    $('#manterCliente').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        var recipient = button.data('whatever') 
        var modal = $(this)
        modal.find('.modal-title').text(recipient)
        
        var dtCorrente = new Date().toISOString().slice(0, 10)

        if(recipient == 'Novo cliente') {
            limparCamposModal()
            $('#dt_cadastro').val(dtCorrente)
        }

        $('#dt_nascimento').attr('max', dtCorrente)
    })
}

function carregarBuscaTabela(){
    $("#buscarCliente").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#clientes tr").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
}


