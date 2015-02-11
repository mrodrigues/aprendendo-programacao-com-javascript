app = angular.module("aprendendoJavascript", []);

app.config(function($sceProvider) {
  $sceProvider.enabled(false);
});

app.directive("codeEditor", function() {
  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      answer: '=',
      prefill: '='
    },
    template: '\
<div class="code-panel">\
  <ul class="nav nav-tabs">\
    <li ng-class="{active: editMode}"><a ng-click="showEditor()">Editar</a></li>\
    <li ng-class="{active: !editMode}" ng-if="!!answer"><a ng-click="showAnswer()">Resposta</a></li>\
  </ul>\
  <div ng-show="editMode">\
    <textarea class="editor" rows="15"></textarea>\
  </div>\
  <div ng-show="!editMode">\
    <textarea class="answer" rows="15"></textarea>\
  </div>\
</div>\
    ',
    link: function(scope, element, attrs, ngModel) {
      scope.editMode = true;

      scope.showEditor = function() { scope.editMode = true; }
      scope.showAnswer = function() { scope.editMode = false; }
      
      // Editor
      var textareaEditor = angular.element(element).find("textarea.editor");
      textareaEditor.ace({ theme: 'twilight', lang: 'javascript' });
      var editor = textareaEditor.data("ace").editor.ace;
      editor.getSession().on('change', function(e) {
        ngModel.$setViewValue(editor.getValue());
        ngModel.$render();
      });
      if (!!scope.prefill) {
        editor.setValue(scope.prefill);
        editor.selection.clearSelection();
      }

      // Answer
      if (!!scope.answer) {
        var textareaAnswer = angular.element(element).find("textarea.answer");
        textareaAnswer.ace({ theme: 'twilight', lang: 'javascript' });
        var answer = textareaAnswer.data("ace").editor.ace;
        answer.setValue(scope.answer);
        answer.setReadOnly(true);
      }
    }
  };
});

app.directive('exercise', function() {
  return {
    restrict: 'E',
    transclude: true,
    template: '\
<div class="panel">\
  <div class="panel-heading">\
    <h2 class="panel-title" id="{{indexName}}">{{title}}</h2>\
  </div>\
  <div class="panel-body exercise">\
    <p ng-bind-html="explanation"></p>\
    <code-editor ng-model="src" answer="answer" prefill="prefill"></code-editor>\
    <pre class="result" ng-class="resultClass">{{result}}</pre>\
    <button class="btn btn-primary" ng-click="assert()">Executar</button>\
  </div>\
</div>\
    ',
    scope: {
      number: '=',
      indexName: '='
    },
    controller: 'ExerciseCtrl'
  };
});

app.controller("ExerciseCtrl", function($scope) {
  angular.extend($scope, $scope.number);
  $scope.src = $scope.prefill;
  $scope.assert = function() {
    try {
      var output = "=> " + eval($scope.src);
      var result = "";
      for (testCase of $scope.testCases || []) {
        expectationResult = eval(testCase.src);
        if (expectationResult == testCase.expected) {
          result = "\nSucesso!";
          $scope.resultClass = "success";
        } else {
          result += "\nFalha...\nEsperava que " + testCase.src + " fosse igual à " + testCase.expected + ", mas obteve " + expectationResult;
          $scope.resultClass = "failure";
          break;
        }
      }
      $scope.result = output + result;
    } catch(e) {
      $scope.result = e.toString();
      $scope.resultClass = "failure";
    }
  };
});

app.controller("ApplicationCtrl", function($scope, Lessons) {
  $scope.lessons = Lessons;
});

$(function() {
  // Gambiarra porque o HTML dos enunciados não é compilado, então não é possível usar diretivas.
  $("[wip]").click(function(e) {
    e.preventDefault();
    alert("Capítulo em construção! Procure uma versão mais recente ou espere seu lançamento para ver este material!");
  });
});

app.value("Lessons", [
  {
    key: "valuesAndOperators",
    title: "1 - Valores e Operadores",
    exercises: [
      {
        title: "1.1 - Números",
        prefill: '(1 + (22 % 10)) * 4.5 / 3',
        explanation: '\
<p>Em programação, diversos tipos de <strong>valores</strong> podem ser usados para representar os dados que se pretende transformar em código.\
À esses <strong>valores</strong>, podem ser aplicados <strong>operadores</strong>. Por exemplo, alguns operadores aritméticos podem ser aplicados sobre números,\
como nas aulas de matemática. Eis os que funcionam: <code>+</code>, <code>-</code>, <code>*</code> (multiplicação), <code>/</code> (divisão). De mesmo modo, parênteses \
podem ser usados para definir a ordem das operações. \
Além disso, existe um operador especial e muito útil: <code>%</code> (resto da divisão). Ele será utilizado em diversos exercícios à frente.</p>\
<p>Dá-se o nome de <strong>expressão</strong> à um pedaço de código que resulta num valor, seja um único valor ou uma sequência de operações que resulta nele. \
Execute a expressão abaixo e veja seu resultado. Após isso, experimente mudar valores, operadores e ordem das operações, e perceba como as regras da aritmética se mantém.</p>\
        '
      },

      {
        title: "1.2 - Strings",
        prefill: '"Isto " + \'é \' + "uma sequência de " + \'strings concatenadas!\'',
        explanation: '\
<p>Um outro tipo de <strong>valor</strong> muito usado são as <strong>strings</strong>. String, do inglês "cordão", é uma sequência de caracteres alfanuméricos, \
ou seja, um texto. Para se delimitar uma string, são usadas <strong>aspas</strong> ou <strong>apóstrofos</strong>. Por exemplo:\
<code>"Isso é uma string"</code> possui o mesmo valor de <code>\'Isso é uma string\'</code>.</p>\
<p>Existe um operador que pode ser aplicado sobre valores do tipo string: o de adição (+). Ele serve para <strong>concatenar</strong>, \
ou seja, "juntar" strings. Por exemplo: <code>"Meu nome é " + "Daniel"</code> resulta em uma única string de valor <code>"Meu nome é Daniel"</code>. \
Repare no espaço ao final da primeira string; caso não tivesse sido colocado, o resultado teria sido <code>"Meu nome éDaniel"</code>.</p>\
<p>Experimente abaixo concatenar algumas strings. Repare que usar aspas ou apóstrofos não altera o resultado.</p>\
        '
      },

      {
        title: "1.3 - Booleans",
        prefill: "!(true && (false || true))",
        explanation: '\
<p>Valores do tipo <strong>boolean</strong>, ou <strong>booleanos</strong>, são valores lógicos que podem ser apenas um dos seguintes valores: \
<code>true</code> e <code>false</code>. Embora simples, eles são fundamentais para a computação, desde o hardware até o software. \
Sobre os valores booleanos, podem ser aplicados os <strong>operadores lógicos</strong>: <code>!</code> (not), <code>&&</code> (and) e <code>||</code> (or).</p>\
<p>O operador <code>!</code> é unário (aplica-se sobre um único operando), e representa negação, e inverte o valor booleano. Segue abaixo uma tabela que representa essas transformações:</p>\
<table class="table table-striped">\
  <thead>\
    <tr>\
      <td>Valor</td>\
      <td><code>!</code></td>\
    </tr>\
  </thead>\
  <tbody>\
    <tr>\
      <td><code>true</code></td>\
      <td><code>false</code></td>\
    </tr>\
    <tr>\
      <td><code>false</code></td>\
      <td><code>true</code></td>\
    </tr>\
  </tbody>\
</table>\
<p>O operador <code>&&</code> é binário (aplica-se sobre dois operandos), e resulta em <code>true</code> apenas se os dois operandos forem verdadeiros.</p>\
<table class="table table-striped">\
  <thead>\
    <tr>\
      <td>&&</td>\
      <td><code>true</code></td>\
      <td><code>false</code></td>\
    </tr>\
  </thead>\
  <tbody>\
    <tr>\
      <td><code>true</code></td>\
      <td><code>true</code></td>\
      <td><code>false</code></td>\
    </tr>\
    <tr>\
      <td><code>false</code></td>\
      <td><code>false</code></td>\
      <td><code>false</code></td>\
    </tr>\
  </tbody>\
</table>\
<p>Por fim, o operador <code>||</code>, também binário, resulta em <code>false</code> apenas se os dois operandos forem falsos.</p>\
<table class="table table-striped">\
  <thead>\
    <tr>\
      <td>&&</td>\
      <td><code>true</code></td>\
      <td><code>false</code></td>\
    </tr>\
  </thead>\
  <tbody>\
    <tr>\
      <td><code>true</code></td>\
      <td><code>true</code></td>\
      <td><code>true</code></td>\
    </tr>\
    <tr>\
      <td><code>false</code></td>\
      <td><code>true</code></td>\
      <td><code>false</code></td>\
    </tr>\
  </tbody>\
</table>\
<p>Estas operações podem parecer simples ou sem propósito num primeiro momento, mas serão fundamentais \
quando chegarmos no tópico <a href="#conditionalsAndRepetitions_0">Condicionais</a>. Experimente a expressão abaixo e verifique se entende o resultado.</p>\
        '
      },

      {
        title: "1.4 - Operadores relacionais",
        prefill: '(2 >= 2) && (4 < 5) && ("Marcos" > "Daniel") && ("abacate" != "laranja")',
        explanation: '\
<p>Operadores relacionais, ou de comparação, são binários e aplicam um teste sobre os operandos, retornando um valor <strong>booleano</strong> como resultado: \
<code>true</code> caso o teste seja verdadeiro, <code>false</code> caso o teste seja falso. \
São eles: <code>==</code> (igual), <code>!=</code> (diferente), <code>&gt;</code> (maior que), <code>&lt;</code> (menor que), <code>&gt;=</code> (maior ou igual à) \
e <code>&lt;=</code> (menor ou igual à).</p>\
<p>Em geral, estes operadores são usados com valores ou expressões aritméticas, mas é possível utilizá-los também com strings. Os operadores de igualdade e diferença \
comportam-se como esperado: <code>"abc" == "abc"</code> resulta em <code>true</code>, e <code>"abc" != "abc"</code> em <code>false</code>. Em JavaScript, também \
é possível usar os operadores maior, menor, etc. para strings, e nesse caso a comparação feita é em relação à ordem alfabética. Por exemplo: <code>"Marcos" > "Daniel"</code> \
resulta em <code>true</code>.</p>\
        '
      },

      {
        title: "1.5 - Variáveis e Atribuição",
        prefill: 'var nome = "Marcos";\nnome = "Lucas";\n"Meu nome é " + nome;',
        answer: 'var nome = "Marcos";\nnome = "Daniel";\n"Meu nome é " + nome;',
        testCases: [{src: "nome", expected: "Daniel"}],
        explanation: '\
<p>Apenas escrever expressões e valores no computador não teria muita utilidade se não pudéssemos guardar esses resultados para utilizá-los de novo. Imagine se precisássemos \
reescrever um cálculo complexo a todo momento, ou pedir para o usuário digitar seu nome toda vez em que for usá-lo? Para isso, existem as <strong>variáveis</strong>. Elas \
funcionam como se fossem caixas rotuladas contendo um único valor de algum tipo. Existem duas operações que podem ser realizadas sobre variáveis: <strong>atribuir</strong> \
um valor ou <strong>recuperar</strong> seu valor.\
<p>Para se atribuir ("guardar" um valor dentro da caixa), usa-se o <code>nomeDaVariavel = [expressão]</code> (sim, \
apenas um <code>=</code>), na qual <code>[expressão]</code> é qualquer expressão que resulte num valor (caso tenha dúvidas do que é uma expressão, leia de novo o exercício \
<a href="#valuesAndOperators_0">1.1 - Números</a>.</p>\
<p>Para se acessar o valor de uma variável, basta chamar seu nome: <code>nomeDaVariavel</code>. O nome de uma variável precisa seguir algumas regras: deve ser iniciado por \
uma letra ou caracter especial permitido (em JavaScript, são <code>_</code> e <code>$</code>), e depois zero ou mais letras, caracteres especiais permitidos e números \
(nada de espaço!). Por exemplo, alguns nomes de variáveis válidos são: <code>nomeDaVariavel</code>, <code>nome_da_variavel</code>, <code>_nome</code>, <code>$nome</code>, \
<code>$_nome$1</code> (mas não faça isso pelamordedeus, vamos manter os nomes simples). Alguns nomes inválidos: <code>nome da variavel</code>, <code>1_nome</code>, \
<code>nome!</code>.</p>\
<p>Algo que pode confundir aqueles que se lembram das aulas de matemática é que a expressão <code>x = x + 1</code> é perfeitamente válida. Não apenas isso, mas \
é uma das mais utilizadas. Para compreendermos o que está havendo, basta reparar na fórmula da atribuição: <code>nomeDaVariavel = [expressão]</code>. Repare \
que <code>[expressão]</code> pode ser qualquer coisa, inclusive uma variável! Quando você utiliza uma variável dentro de uma expressão, você acessa o valor guardado \
dentro dela. Portanto, <code>x = 1; x = x + 1</code> resulta com <code>x == 2</code>.</p>\
<p>Por fim, é uma boa prática fazer com que a inicialização (primeira atribuição) de uma variável utilize a palavra-chave <code>var</code>. \
Por exemplo: <code>var nome = "Marcos"</code>. Após isto, as atribuições podem ocorrer de forma normal. Embora não seja obrigatório, é importante se acostumar com \
essa boa prática por motivos que serão explicados no capítulo <a wip>Escopos</a>.</p>\
<p>Execute o código abaixo. Para passar neste exercício, altere o código para que a variável <code>nome</code> <strong>termine</strong> a execução com o valor "Daniel".</p>\
        '
      },

      {
        title: "1.6 - Comentários",
        prefill: '\
// Comentário de uma linha\n\
\n\
/*\n\
   Comentário\n\
   de\n\
   várias\n\
   linhas\n\
*/\n\
\n\
/*\n\
 * Comentário\n\
 * de\n\
 * várias\n\
 * linhas\n\
 * com\n\
 * bom estilo\n\
 */\n\
        ',
        explanation: '\
<p>Isso é um pouco trapaça, afinal comentários não são realmente valores, mas é uma boa hora de falarmos deles. \
Comentários são, como o próprio nome diz, observações sobre o nosso código. Eles são completamente ignorados pelo \
programa que executa seu código, e servem apenas para ajudar na hora de ler um código. Devem ser evitados, uma vez \
que espera-se sempre escrever códigos tão simples e legíveis que não sejam precisas explicações adicionais, mas em \
alguns lugares são apropriados.</p>\
<p>Um comentário pode ser de apenas uma linha, sendo iniciado por <code>//</code>, ou abranger várias linhas, \
iniciando com <code>/*</code> e terminando em <code>*/</code> (a ordem do asterisco-barra ou barra-asterisco é importante).</p>\
        '
      },

      {
        title: "1.7 - Não-valores: undefined e null",
        prefill: '\
// alert("Mensagem");\n\
// typeof variavelNaoExistente;\n\
// typeof undefined;\n\
        ',
        explanation: '\
<p><strong>ATENÇÃO:</strong> Este assunto envolve alta concentração de <strong>Bizarrices do JavaScript ou da Programação em Geral</strong> <i class="troll" />. \
Mais a frente esses tópicos serão melhor explicados; por enquanto, quando aparecer alguma <strong>Bizarrice do JavaScript ou da Programação em Geral</strong> será mostrado \
o símbolo <i class="troll" />, e pede-se que se ignore o assunto por enquanto.</p>\
<p>Existem dois "não-valores" especiais que, embora raramente sejam usados explicitamente, fazem parte do dia-a-dia de qualquer programador. \
<code>undefined</code> (ver <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined">undefined</a>) \
é o "valor" de variáveis não inicializadas ou de comandos que não resultam num valor. O comando <code>typeof</code> retorna uma \
string com o tipo de um valor qualquer (teoricamente, <i class="troll" />), \
e pode ser usado para verificar que um valor, por exemplo uma variável nunca antes utilizada, é <code>undefined</code>:</p>\
<pre><code>\
typeof variavelNuncaAntesUtilizada;\n\
=> "undefined"\
</pre></code>\
<p>De mesma forma, chamar a função (ver <a href="#functions_0">Funções</a>) <code>alert("Mensagem")</code> retorna um <code>undefined</code>.</p>\
<p>O valor <code>null</code> (ver <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null">null</a>) também \
representa um "não-valor", mas nunca é resultado de nenhuma expressão (como o <code>undefined</code>) a não ser que \
seja explicitamente dito, por exemplo: <code>var a = null;</code>. Este valor será usado em algumas técnicas mais avançadas de programação.</p>\
<p>Execute o código abaixo e verifique o resultado. Remova um à um os comentários e verifique o resultado de cada um.</p>\
        '
      },

      {
        title: "1.8 - Operador + atribuição",
        prefill: '\
var i = 10;\n\
i = i + 1\n\
i = i / 2;\n\
i = i + 2;\n\
i = i * 2;\n\
i = i % 2;\n\
i = i - 1;\n\
alert(i);\n\
        ',
        explanation: '\
<p>A sequência <code>variavel = variavel [operador] outraVariavel</code> é extremamente comum em programação, tanto que foram criados atalhos: \
<code>a += 1</code>, <code>a *= 2</code>, <code>a -= 1</code>, <code>a /= 2</code> e <code>a %= 2</code> são todos comandos válidos e equivalentes à sequência \
mostrada, com os respectivos operadores. A expressão <code>saudacoes += " Daniel!"</code> também funciona como se esperaria. Além disso, para um dos casos mais \
comuns de todos, o <strong>incremento</strong> e <strong>decremento</strong> podem ser reduzidos, respectivamente, à <code>variavel++</code> e <code>variavel--</code>.</p>\
<p>Isto conclui o assunto sobre variáveis e seus operadores. Ainda existem alguns operadores especiais, utilizados para operações com números binários, que não serão \
abordados. No exemplo a seguir, conserte o código dado para utilizar as respectivas versões simplificadas.</p>\
        '
      }
    ]
  },

  {
    key: "functions",
    title: "2 - Funções",
    exercises: [
      {
        title: "2.1 - Declaração",
        prefill: '\
var notificar = function() {\n\
  alert("Ocorreu um erro!");\n\
}\n\
\n\
notificar();',
        explanation: '\
<p>Assim como variáveis permitem reutilizar valores, funções permitem reutilizar <strong>statements</strong> (informalmente, comandos que fazem uma única coisa e \
que são separados por <code>;</code>). Uma função é um conjunto de 1 ou mais statements que possui um nome, e pode ser executada em qualquer lugar ao chamar seu nome. \
Declarar uma função significa associar este nome ao bloco de statements. Por exemplo (os parênteses e as chaves são necessários):</p>\
<pre><code>\
function notificar() {\n\
  var mensagem = "Ocorreu um erro!";\n\
  alert(mensagem);\n\
}\
</code></pre>\
<p>A função <code>alert</code> é nativa do JavaScript, e mostra uma mensagem para o usuário. A mensagem, um valor <strong>string</strong>, é passado como \
<strong>argumento</strong> para a função (ver <a href="#functions_1">2.2 - Parâmetros e Argumentos</a>). A função que declaramos, então, serve para notificar \
o usuário de um erro. Uma outra forma de declarar uma função é:</p>\
<pre><code>\
var notificar = function () {\n\
  var mensagem = "Ocorreu um erro!";\n\
  alert(mensagem);\n\
};\
</code></pre>\
<p>Dessa forma, é possível perceber que funções não passam de um tipo especial de valor, e assim como outros valores podem ser armazenadas em variáveis e passadas \
como argumentos para outras funções. Nem todas as linguagens de programação permitem isso, mas vamos esquecer desse detalhe por enquanto. Estamos usando JavaScript, \
uma das linguagens mais versáteis existentes! Agora que temos uma função declarada, como fazemos para executar o código dela? Basta chamar seu nome seguido de \
parênteses: <code>notificar()</code>. Assim como variáveis, o chamar o nome de uma função é como tirar ela de dentro da caixa. Os parênteses funcionam como uma ordem: \
pegue isso que eu acabei de tirar da caixa e execute.</p>\
<p>Execute o código abaixo e veja seu resultado. Experimente remover os parênteses da chamada de função e repare no resultado. O que você entende por isso?</p>\
        '
      },

      {
        title: "2.2 - Parâmetros e Argumentos",
        prefill: '\
function notificar(codigo, erro) {\n\
  alert("[" + codigo + "] Ocorreu um erro: " + erro);\n\
}\n\
\n\
notificar(403, "Usuário não logado");\
        ',
        explanation: '\
<p>No exemplo anterior, a função <code>alert</code> recebeu um <strong>argumento</strong>, ou seja, um valor, que foi usado para mostrar uma mensagem para o\
usuário. Também podemos declarar funções que recebam argumentos, basta listar os <strong>parâmetros</strong> que receberão esses valores. Por exemplo:</p>\
<pre><code>\
function notificar(codigo, erro) {\n\
  alert("[" + codigo + "] Ocorreu um erro: " + erro);\n\
}\n\
\n\
notificar(403, "Usuário não logado");\n\
</code></pre>\
<p>Neste exemplo, <code>403</code> e <code>"Usuário não logado"</code> são os argumentos, os <strong>valores</strong> passados para a função, e \
<code>codigo</code> e <code>erro</code> são os parâmetros, ou seja, tipos especiais de <strong>variável</strong> que recebem os argumentos passados\
para a função de acordo com a <strong>ordem</strong>. Ou seja, <code>403</code> vai parar dentro de <code>codigo</code>. Repare que, caso o valor a ser passado \
como argumento esteja dentro de uma variável, esta não precisa possuir o mesmo nome do respectivo parâmetro, uma vez que é utilizada no contexto de expressão, ou seja, \
apenas seu valor é utilizado. Por exemplo: <code>var treta = "Usuário não logado"; notificar(403, treta)</code> funciona de forma semelhante à mostrada acima. De \
mesmo modo, não é necessário se preocupar caso uma função possua um parâmetro com o mesmo nome de uma variável utilizada em outro lugar. Por exemplo: \
<code>var erro = "Outro erro não relacionado"; notificar(403, "Usuário não logado")</code> não altera o valor da variável <code>erro</code> (experimente!).</p>\
<p>Experimente trocar a ordem dos <strong>parâmetros</strong> na função abaixo. Em seguida troque a ordem dos <strong>argumentos</strong>.</p>\
        '
      },

      {
        title: "2.3 - Retorno",
        answer: '\
function divisivel(a, b) {\n\
  return a % b == 0;\n\
}\
        ',
        prefill: 'function divisivel(a, b) {\n}',
        explanation: '\
<p>Uma função pode possuir um valor de <strong>retorno</strong>, sendo especificado através do comando <code>return</code>. \
Isto significa que, após ser chamada, ela <strong>retornará</strong> o valor especificado no mesmo local onde foi chamada. Por exemplo:</p>\
<pre><code>\
function mensagemDeErro(codigo, erro) {\n\
  return "[" + codigo + "] Ocorreu um erro: " + erro;\n\
}\n\
\n\
var mensagem = mensagemDeErro(403, "Usuário não autorizado");\n\
alert(mensagem);\n\
</code></pre>\
<p>Repare que o retorno de uma função é um valor como qualquer outro, e pode ser armazenado numa variável ou enviado para uma função, como qualquer outro.</p>\
<p>Como exercício, crie uma função <code>divisivel(a, b)</code> que retorne <code>true</code> caso\
<code>a</code> seja divisível por <code>b</code>, e <code>false</code> em caso contrário. Caso precise de ajuda, clique na aba <strong>Resposta</strong>.</p>\
        ',
        testCases: [
          { src: "divisivel(10, 2)", expected: true },
          { src: "divisivel(10, 3)", expected: false }
        ]
      }
    ]
  },

  {
    key: "conditionalsAndRepetitions",
    title: "3 - Condicionais e Repetições",
    exercises: [
      {
        title: "3.1 - Condicional simples",
        prefill: '\
if (2 * 3 == 5) {\n\
  alert("Entrou no condicional!");\n\
}\
        ',
        explanation: '\
<p>A maior diferença entre um computador e outros tipos de máquinas como calculadoras é a capacidade de tomar decisões. \
Sem isso, um programa serviria apenas para atender um único caso sempre, e mesmo assim não conseguiria resolver diversos \
problemas. A estrutura condicional <code>if ([expressão booleana]) { [bloco de código] }</code> permite que, dada uma <code>[expressão booleana]</code> \
qualquer, caso seu resultado seja <code>true</code>, o <code>[bloco de código]</code> seja executado. As chaves somente são necessárias caso o bloco de \
código tenha mais de uma linha, mas vai por mim, use sempre com chaves; poupa muito trabalho na hora de debuggar. Por exemplo, em algum jogo:</p>\
<pre><code>\
vida = vida - dano;\n\
if (vida <= 0) {\n\
  morre();\n\
}\n\
</code></pre>\
<p>No exemplo abaixo, experimente usar o operador lógico de negação para fazer com que o código dentro do condicional seja executado.</p>\
        '
      },

      {
        title: "3.2 - Condicional de duas vias",
        prefill: '\
function somaComLimite(valorAtual, valorASomar, limite) {\n\
  return valorAtual + valorASomar;\n\
}\n\
        ',
        testCases: [
          { src: "somaComLimite(5, 4, 10);", expected: 9 },
          { src: "somaComLimite(5, 5, 10);", expected: 10 },
          { src: "somaComLimite(5, 6, 10);", expected: 10 }
        ],
        answer: '\
function somaComLimite(valorAtual, valorASomar, limite) {\n\
  var soma = valorAtual + valorASomar;\n\
  if (soma > limite) {\n\
    return limite;\n\
  } else {\n\
    return soma;\n\
  }\n\
}\n\
        ',
        explanation: '\
<p>Existem muitas operações que são mutuamente exclusivas. Por exemplo, digamos que estejamos fazendo um clone de Super Mario Bros:</p>\
<pre><code>\
if (acertouInimigo()) {\n\
  if (pegouEstrela()) {\n\
    mataInimigo();\n\
  }\n\
\n\
  if (!pegouEstrela()) {\n\
    morre();\n\
  }\n\
}\n\
</code></pre>\
<p>É um tanto quanto repetitivo reescrever o teste com uma negativa logo abaixo. Como esse é um caso muito comum, foi criada uma estrutura \
especial para ele:</p>\
<pre><code>\
if (acertouInimigo()) {\n\
  if (pegouEstrela()) {\n\
    mataInimigo();\n\
  } else {\n\
    morre();\n\
  }\n\
}\n\
</code></pre>\
<p>Neste exemplo, também pudemos notar que é possível <strong>aninhar</strong> condicionais (colocar um dentro do outro), assim como o valor da \
<strong>indentação</strong> ("nível" de espaçamento ou tabulação de cada bloco de código).</p>\
<p>Neste exercício, conserte a função <code>somaComLimite(valorAtual, valorASomar, limite)</code> para que ela retorne <code>valorAtual + valorASomar</code> apenas caso \
esta soma seja menor ou igual ao <code>limite</code>. Caso o ultrapasse, retorne o <code>limite</code>. Este exercício possui mais de uma forma de se resolver, \
mas para testar a estrutura <code>if-else</code>, utilize-a.</p>\
        '
      },

      {
        title: "3.3 - Condicional de múltiplas vias",
        prefill: '\
function move(x, y, direcao) {\n\
  if (direcao == "cima") {\n\
    y += 1;\n\
  } else if (direcao == "baixo") {\n\
    y -= 1;\n\
  } else if (direcao == "direita") {\n\
    x += 1;\n\
  } else if (direcao == "esquerda") {\n\
    x -= 1;\n\
  } else {\n\
    alert("Direção inexistente! Movimento cancelado.");\n\
  }\n\
\n\
  return "(" + x + ", " + y + ")";\n\
}\n\
\n\
alert(move(10, 10, prompt("Para direção deseja seguir?")));\
        ',
        explanation: '\
<p>Outra estrutura bastante comum é o encadeamento de <code>if-else</code>, por exemplo para a seleção de uma opção:</p>\
<pre><code>\
var opcao = prompt("Qual opção deseja executar?");\n\
if (opcao == "começar") {\n\
  comecarJogo();\n\
} else if (opcao == "configurar") {\n\
  configurar();\n\
} else if (opcao == "sair") {\n\
  sair();\n\
} else {\n\
  alert("Opção inválida!");\n\
}\n\
</code></pre>\
<p>No código acima, a função <code>prompt</code> abre uma caixa para que o usuário digite uma opção e a retorna, neste caso para a variável <code>opcao</code>. \
Como essa estrutura também é bastante comum, foi criada uma forma mais sucinta de se executá-la:</p>\
<pre><code>\
var opcao = prompt("Qual opção deseja executar?");\n\
switch (opcao) {\n\
  case "começar":\n\
    comecarJogo();\n\
    break;\n\
  case "configurar":\n\
    configurar();\n\
    break;\n\
  case "sair":\n\
    sair();\n\
    break;\n\
  default:\n\
    alert("Opção inválida!");\n\
}\n\
</code></pre>\
<p>Este código possui funcionamento semelhante ao anterior. O <code>default</code> funciona como o último <code>else</code> da cadeia de <code>if-else</code>, \
e é sempre uma boa ideia colocá-lo para impedir que opções incorretas passem despercebidas. \
O <code>break</code> é necessário pois, caso não fosse colocado e a primeira opção fosse selecionada, \
todas as outras executariam também. O porquê disso fica para outro dia <i class="troll" />.</p>\
<p>Neste exercício, conserte o código abaixo para utilizar o <code>switch</code>.</p>\
        '
      },

      {
        title: "3.4 - Recursão",
        prefill: '\
function fibonacci(x) {\n\
  if (x == 0) {\n\
    return 0;\n\
  } else if (x == 1) {\n\
    return 1;\n\
  } else {\n\
    return // PREENCHA AQUI\n\
  }\n\
}\n\
        ',
        answer: '\
function fibonacci(x) {\n\
  if (x == 0) {\n\
    return 0;\n\
  } else if (x == 1) {\n\
    return 1;\n\
  } else {\n\
    return fibonacci(x - 1) + fibonacci(x - 2);\n\
  }\n\
}\n\
        ',
        testCases: [
          { src: "fibonacci(2);", expected: 1 },
          { src: "fibonacci(10);", expected: 55 },
          { src: "fibonacci(20);", expected: 6765 }
        ],
        explanation: '\
<p>Agora que você conhece condicionais, pode aprender um recurso mais avançado. \
Como foi visto antes, é possível chamar uma função dentro de outra, como o <code>alert</code> dentro do <code>notificar</code>. \
Uma característica interessante (e um tanto quanto perigosa) das funções é que elas também podem chamar a si mesmas! Por exemplo, \
<code>notificar</code> poderia chamar <code>notificar</code>, que chamaria <code>notificar</code>, e assim por diante. Obviamente \
essa função não seria muito útil, pois nunca chegaria à um fim, e poderia estourar a memória do computador. Este comportamento não é \
desejável, ao qual dá-se o nome de recursão infinita. Em geral, os programas que executam código impedem que se estoure a memória, lançando \
um erro (no caso de JavaScript é o <code>RangeError: Maximum call stack size exceeded</code>).</p>\
<p>Então, para quê serve a recursão? Basicamente, ela é uma forma de se executar uma repetição de código, atualizando-se um contexto a cada \
chamada até que se obtenha um caso básico. É um bom exercício de lógica matemática: eu posso não saber como resolver um caso complexo, mas sei \
resolver o simples, e sei como dar um passo de cada vez para reduzir o complexo até chegar no simples.</p>\
<p>Existem algumas soluções que são representadas facilmente através de funções recursivas. Um exemplo clássico é o cálculo do <strong>fatorial</strong> de um número. \
O fatorial é uma operação matemática, muito utilizada em análise combinatória, que é definida como o produto de um número por todos os \
números positivos menores que ele e maiores que zero. Ou seja, o <code>fatorial(5) == 5 * 4 * 3 * 2 * 1 == 120</code>.</p>\
<pre><code>\
function fatorial(x) {\n\
  if (x > 1) {\n\
    return x * fatorial(x - 1);\n\
  } else {\n\
    return 1;\n\
  }\n\
}\n\
\n\
fatorial(5);\n\
</code></pre>\
<p>Preencha a função <code>fibonacci</code> abaixo com o código que retorna o número na posição informada da \
<a target="_blank" href="http://pt.wikipedia.org/wiki/Sequ%C3%AAncia_de_Fibonacci">Sequência de Fibonacci</a>. Esta sequência é iniciada com 0 e 1, \
e o resto dos números é gerado somando-se os dois números anteriores na sequência <strong>infinitamente</strong>. Por exemplo: \
<code>0, 1, (1 + 0 == 1), (1 + 1 == 2), (2 + 1 == 3), (3 + 2 == 5), (5 + 3 == 8), (8 + 5 == 13), (13 + 8 == 21), ...</code>. \
Como não é plausível gerar uma sequência infinita de números, pedimos que gere apenas o \
número na posição passada como parâmetro. Para facilitar, os casos finais da recursão já estão preenchidos; falta apenas a redução.</p>\
        '
      },

      {
        title: "3.5 - Repetição simples",
        prefill: '\
// Versão melhorada da resposta da questão anterior!\n\
function fibonacci(x) {\n\
  if (x < 2) {\n\
    return x;\n\
  } else {\n\
    return fibonacci(x - 1) + fibonacci(x - 2);\n\
  }\n\
}\n\
        ',
        answer: '\
// São apresentadas duas soluções neste problema, a primeira é uma tradução\n\
// mais direta da solução recursiva, e um pouco mais simples, embora mais\n\
// trabalhosa.\n\
function fibonacci(x) {\n\
  if (x < 2) {\n\
    return x;\n\
  } else {\n\
    var resultado_menos_2 = 0;\n\
    var resultado_menos_1 = 1;\n\
    var resultado = 1;\n\
    var i = 1;\n\
    while (i < x) {\n\
      resultado = resultado_menos_1 + resultado_menos_2;\n\
      resultado_menos_2 = resultado_menos_1;\n\
      resultado_menos_1 = resultado;\n\
      i++;\n\
    }\n\
    return resultado;\n\
  }\n\
}\n\
\n\
// Esta solução é mais compacta, porém mais complexa. Sugere-se\n\
// copiar o código de ambas e verificar que funcionam igualmente.\n\
// Você consegue compreender como esta solução funciona?\n\
function fibonacci(x) {\n\
  var resultado_menos_2 = 0;\n\
  var resultado_menos_1 = 1;\n\
  var i = 0;\n\
  while (i < x) {\n\
    var temp_resultado_menos_2 = resultado_menos_2;\n\
    resultado_menos_2 = resultado_menos_1;\n\
    resultado_menos_1 = temp_resultado_menos_2 + resultado_menos_1;\n\
    i++;\n\
  }\n\
  return resultado_menos_2;\n\
}\n\
        ',
        testCases: [
          { src: "fibonacci(2);", expected: 1 },
          { src: "fibonacci(10);", expected: 55 },
          { src: "fibonacci(20);", expected: 6765 }
        ],
        explanation: '\
<p>Embora a recursão produza soluções muito elegantes, possui alguns problemas. Em programação, quando uma função chama outra, é realizada uma \
<strong>troca de contexto</strong> (mais sobre isso no capítulo sobre <a wip>Escopos</a>). Para tal, os contextos de cada função são\
empilhados em uma estrutura apropriadamente conhecida como pilha (ver <a wip>Estruturas de Dados</a>). Digamos que, no exemplo anterior,  \
buscássemos o fatorial de 1000. Para realizar esse cálculo através de recursão, precisaríamos empilhar 1000 contextos de função! Além de gastar muita \
memória, a operação de troca de contexto é lenta, portanto precisamos de uma forma mais adequada de se realizar repetições. Daí entram as <strong>estruturas \
de repetição</strong>, ou <strong>loops</strong>, ou <strong>iterações</strong>! Uma estrutura de repetição nada mais é do que um bloco de código \
(que nem nas funções e condicionais) junto à uma condição. <strong>Enquanto (while)</strong> a condição for verdadeira, o bloco é executado. Neste \
primeiro momento, veremos apenas o pai de todas as repetições: <code>while ([expressão booleana]) { [bloco de código] }</code>. Veja este exemplo:</p>\
<pre><code>\
var option = null;\n\
while (option == null) {\n\
  option = prompt("Selecione uma opção: começar, configurar ou sair");\n\
  switch (option) {\n\
    case "começar":\n\
      comecarJogo();\n\
      break;\n\
    case "configurar":\n\
      configurar();\n\
      break;\n\
    case "sair":\n\
      sair();\n\
      break;\n\
    default:\n\
      option = null;\n\
  }\n\
}\n\
</code></pre>\
<p>Lembra que foi dito em <a href="#valuesAndOperators_6">1.7 - Não valores: undefined e null</a> que veríamos o <code>null</code> sendo utilizado em \
técnicas de programação mais avançada? Este é um exemplo bastante comum: inicializamos com <code>null</code> uma variável que "prometemos" ser \
eventualmente preenchida com um valor, e realizamos uma repetição até que se consiga obter um dos valores permitidos. Neste caso, enquanto a condição é \
que a variável possua um valor igual à <code>null</code>; enquanto isso ocorrer, continuaremos perguntando ao usuário até que ele responda uma opção válida. \
Uma outra forma de ver é que a repetição apenas não ocorrerá quando <code>option</code> não for mais <code>null</code> (em programação, às vezes fica mais \
fácil de enxergar a lógica aplicada se você inverter a pergunta).</p>\
<p>Existe uma relação interessante entre recursão e repetição: toda função recursiva pode ser transformada em uma repetição (ou forma iterativa). De fato, \
em algumas linguagens isso é feito <a target="_blank" href="http://en.wikipedia.org/wiki/Tail_call">automaticamente pelo compilador</a> (veremos mais sobre compiladores em \
<a wip>Compiladores e Interpretadores</a>)! Veja a função <code>fatorial</code> transformada num equivalente com <code>while</code>:</p>\
<pre><code>\
function fatorial(x) {\n\
  var resultado = x;\n\
  x--; // Lembra desse operador + atribuição?\n\
  while (x > 1) {\n\
    resultado *= x; // E desse?\n\
    x--;\n\
  }\n\
  return resultado;\n\
}\n\
</code></pre>\
<p>Reparou que a expressão condicional do caso básico na recursão virou a expressão condicional da repetição? Isso, em conjunto com uma etapa de inicialização \
(que em geral envolve a repetição de algum comando dentro do bloco de código da repetição, neste caso o <code>x--</code>), é uma forma bastante usada para a \
essa transformação! Claro que, como quase tudo em programação, sempre existe mais de uma solução possível:</p>\
<pre><code>\
function fatorial(x) {\n\
  var resultado = 1;\n\
  var i = 1;\n\
  while (i <= x) {\n\
    resultado *= i;\n\
    i++;\n\
  }\n\
  return resultado;\n\
}\n\
</code></pre>\
<p>Este formato, com a inicialização de uma <code>variável de controle do loop</code>, com o incremento/decremento da mesma sendo executado ao final do \
bloco de código até que um limite bem definido o faça encerrar a repetição, é tão comum que, como em geral acontece na programação, foi criado um atalho \
para ele, o qual será explicado em <a wip>Repetição definida: for</a>. O que podemos perceber nas soluções apresentadas é que perde-se a \
elegância da recursividade, em que se aborda casos simples e a redução até os mesmos através da mudança de contexto, e passa-se a controlar a execução \
através de alguma estrutura de controle. É encorajado que, quando se deparar com algum problema difícil, busque-se uma solução recursiva, em geral mais \
simples de se obter, para depois convertê-la para o método iterativo uma vez que se prove correta.</p>\
<p>Neste exercício, você deverá transformar a função <code>fibonacci</code>, vista no exercício passado, para o método iterativo. Fica a lembrança: será necessário \
armazenar o contexto atual e atualizá-lo através de alguma estrutura de controle, ao invés de simplesmente realizar a redução à casos mais simples da recursão.</p>\
        '
      }
    ]
  }
]);
