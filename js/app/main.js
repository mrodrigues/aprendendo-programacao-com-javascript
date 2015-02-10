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
    <textarea class="editor" rows="10"></textarea>\
  </div>\
  <div ng-show="!editMode">\
    <textarea class="answer" rows="10"></textarea>\
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

app.controller("ExerciseCtrl", function($scope, $sce) {
  angular.extend($scope, $scope.number);
  $scope.src = $scope.prefill;
  $scope.assert = function() {
    try {
      $scope.result = "=> " + eval($scope.src);
      for (testCase of $scope.testCases || []) {
        expectationResult = eval(testCase.src);
        if (expectationResult == testCase.expected) {
          $scope.result += "\nSucesso!";
          $scope.resultClass = "success";
        } else {
          $scope.result += "\nFalha...\nEsperava que " + testCase.src + " fosse igual à " + testCase.expected + ", mas obteve " + expectationResult;
          $scope.resultClass = "failure";
          break;
        }
      }
    } catch(e) {
      $scope.result = e.toString();
      $scope.resultClass = "failure";
    }
  };
});

app.controller("ApplicationCtrl", function($scope, Lessons) {
  $scope.lessons = Lessons;
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
quando chegarmos no tópico <a href="#conditionals">Condicionais</a>. Experimente a expressão abaixo e verifique se entende o resultado.</p>\
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
<a href="#0_0">1.1 - Números</a>.</p>\
<p>Para se acessar o valor de uma variável, basta chamar seu nome: <code>nomeDaVariavel</code>. O nome de uma variável precisa seguir algumas regras: deve ser iniciado por \
uma letra ou caracter especial permitido (em JavaScript, são <code>_</code> e <code>$</code>), e depois zero ou mais letras, caracteres especiais permitidos e números \
(nada de espaço!). Por exemplo, alguns nomes de variáveis válidos são: <code>nomeDaVariavel</code>, <code>nome_da_variavel</code>, <code>_nome</code>, <code>$nome</code>, \
<code>$_nome$1</code> (mas não faça isso pelamordedeus, vamos manter os nomes simples). Alguns nomes inválidos: <code>nome da variavel</code>, <code>1_nome</code>, \
<code>nome!</code>.</p>\
<p>Por fim, é uma boa prática fazer com que a inicialização (primeira atribuição) de uma variável utilize a palavra-chave <code>var</code>. \
Por exemplo: <code>var nome = "Marcos"</code>. Após isto, as atribuições podem ocorrer de forma normal. Embora não seja obrigatório, é importante se acostumar com \
essa boa prática por motivos que serão explicados no capítulo <a href="#replace">Escopos</a>.</p>\
<p>Execute o código abaixo. Para passar neste exercício, altere o código para que a variável <code>nome</code> <strong>termine</strong> a execução com o valor "Daniel".</p>\
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
<p>A função <code>alert</code> é nativa do JavaScript, e mostra uma mensagem para o usuário. A mensagem, um valor <strong>string</strong>, é passado como argumento para \
a função (ver <a href="#functions_1">2.2 - Parâmetros e Argumentos</a>). A função que declaramos, então, serve para notificar o usuário de um erro. \
Uma outra forma de declarar uma função é:</p>\
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
        title: "2.2 - Parâmetros e Argumentos"
      },

      {
        title: "2.3 - Retorno",
        answer: '\
function divisivel(a, b) {\n\
  return a % b == 0;\n\
}\
        ',
        explanation: '\
<p>Crie uma função <code>divisivel(a, b)</code> que retorne <code>true</code> caso\
<code>a</code> seja divisível por <code>b</code>, e <code>false</code> em caso contrário.</p>\
        ',
        testCases: [
          { src: "divisivel(10, 2)", expected: true },
          { src: "divisivel(10, 3)", expected: false }
        ]
      }
    ]
  }
]);
