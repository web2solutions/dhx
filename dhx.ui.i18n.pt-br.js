$dhx.ui.i18n['pt-br'] = {
//$dhx.ui.language = {
	// menu
	File : 'Arquivo'.CFC()
	,New : 'Novo'.CFC()
	,OpenSelected : 'Abrir selecionado'.CFC()
	,PDFVersion : 'Versão em PDF'.CFC()
	,Edit : 'Editar'.CFC()
	,UpdateSelect : 'Alterar selecionado'.CFC()
	,Deleteselected : 'Deletar selecionado'.CFC()
	,Settings : 'Configurações'.CFC()
	,SetUpGridColumns : 'Configurar colunas da grid'.CFC()
	,Formsettings : 'Configurações de formulário'.CFC()
	,Gridsettings : 'Configurações da grid'.CFC()
	,SelectIdiom : 'Selecionar idioma'.CFC()
	,Portuguese : 'Português'.CFC()
	,English : 'English'.CFC()
	,Help : 'Ajuda'.CFC()
	,ReportBug : 'Reportar erros'.CFC()
	,QuickHelp : 'Ajuda rápida'.CFC()
	,AnotherRecords : 'Outros Registros'.CFC()
	,EditNameTable : function(table){
		return table.CFC()	 + ' - gerenciamento'
	}
	// ribbon
	,recordsmanagement : 'gerenciamento de registros'
	,Newrecord : 'Novo registro'
	,Openrecord : 'Abrir registro'
	,FindRecords : 'Procurar registros'
	,updateselected: 'alterar selecionado'
	,deleteselected : 'deletar selecionado'
	,reloaddata : 'recarregar dados'
	,quicknavigation : 'navegação rápida'
	,gotofirstrecord : 'ir para<br>primeiro registro'
	,gotolast : 'ir para o último'
	,gotoprevious : 'ir para o anterior'
	,gotonext : 'ir para o próximo'
	
	
};
$dhx.ui.language = $dhx.extend( $dhx.ui.i18n['pt-br'] );