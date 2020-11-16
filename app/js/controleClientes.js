var listaDeClientes;

$(document).ready(function(){
    carregarClientes()
    carregarConfigsModal()
    carregarBuscaTabela()
})

function carregarClientes(){
    listarClientes().then((dados) => {
        preencheTbody(dados)
        listaDeClientes = dados
        calcularDadosDashboard('m')
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
    var badge = ''
    if(item.renda_familiar <= 980) badge = 'badge-vermelho'
    else if(item.renda_familiar <= 2500) badge = 'badge-amarelo'
    else if(item.renda_familiar > 2500) badge = 'badge-verde'

    return ""
    + "<tr>"
    + "<td>" + item.nome + "</td>"
    + '<td> <span class="' + badge + '">R$ ' + item.renda_familiar.split('.')[0] + "</span></td>"
    + "<td>"
    +   '<button type="button" class="btn btn-sm btn-primary btn-outline btn-1b" onclick="abrirModalCliente(' + item.id + ')" data-tooltip="tooltip" title="Editar" data-toggle="modal" data-target="#manterCliente" data-whatever="Editar cliente"><i class="fas fa-pencil-alt"></i></button>'
    +   '<button type="button" class="btn btn-sm btn-danger btn-outline btn-1b ml-1" onclick="excluir(' + item.id + ')" data-tooltip="tooltip" title="Excluir"><i class="fas fa-trash-alt"></i></i></button>'
    + "</td>"
    + "</tr>"
}

function salvar(){
    if($('#id').val()){
        editarCliente($('#formCliente').serialize()).then((dados) => {
            alert(dados.message)
            if(dados.code == 'ok')
                $('#manterCliente').modal('toggle');
            
            carregarClientes()
        })
    }
    else{
        cadastrarCliente($('#formCliente').serialize()).then((dados) => {
            alert(dados.message)
            if(dados.code == 'ok')
                $('#manterCliente').modal('toggle');
                
            carregarClientes()
        })
    }
}

function excluir(id){
    excluirCliente(id).then((dados) => {
        carregarClientes()
        alert(dados.message)
    })
}

function calcularDadosDashboard(periodo){
    
    var dtAtual = new Date() //verificar a diferenca do utc
    var listaCalcularDados;

    //dados.dt_nascimento.slice(0, 10)

    if(periodo == 'm')//mes
        listaCalcularDados = listaDeClientes.filter(item => new Date(item.dt_cadastro.slice(0, 10)).getMonth() == dtAtual.getMonth())
    else if(periodo == 's')//semana
        listaCalcularDados = listaDeClientes.filter(item => getWeek(new Date(item.dt_cadastro).slice(0, 10)) == getWeek(dtAtual))
    else if (periodo == 'd')//dia
        listaCalcularDados = listaDeClientes.filter(item => getDay(new Date(item.dt_cadastro).slice(0, 10)) == getDay(dtAtual))
    else
        listaCalcularDados = listaDeClientes
    

    var classeA = 0;
    var classeB = 0;
    var classeC = 0;
    var numMedio = 0;

    var rendaMedia = calculoRendaMedia(listaDeClientes)

    $.each(listaCalcularDados, function (key, item) {
        if(item.renda_familiar <= 980) classeA++
        else if(item.renda_familiar <= 2500) classeB++
        else if(item.renda_familiar > 2500) classeC++

        if(item.renda_familiar > rendaMedia) numMedio++
    });


    $('#numClientesA').html(classeA)
    $('#numClientesB').html(classeB)
    $('#numClientesC').html(classeC)
    $('#numMedio').html(numMedio)
}

function getDay(date){
    return 10
}

function getWeek(date){
    return 10
}

function calculoRendaMedia(lista){
    var sum = 0.0

    $.each(lista, function (key, item) {
        sum+= parseFloat(item.renda_familiar)
    });
    return sum/lista.length
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
    console.log('date', new Date(Date.parse(dados.dt_nascimento.slice(0, 10))).format('W'))
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


