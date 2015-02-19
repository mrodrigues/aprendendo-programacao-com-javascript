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
    <h3 class="panel-title" id="{{indexName}}">{{title}}</h3>\
  </div>\
  <div class="panel-body exercise">\
    <p ng-bind-html="explanation"></p>\
    <div class="code" ng-show="!hideCode">\
      <code-editor ng-model="src" answer="answer" prefill="prefill"></code-editor>\
      <pre class="result" ng-class="resultClass">{{result}}</pre>\
      <button class="btn btn-primary" ng-click="assert()">Executar</button>\
    </div>\
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
    key: "concepts",
    title: "0 - Conceitos",
    exercises: [
      {
        title: "0.1 - O que é programação?",
        prefill: 'alert("Hello World!");',
        explanation: '\
<p>Programar, em seu sentido mais básico, significa preparar uma sequência de instruções para que um computador execute. Existem instruções para \
várias coisas diferentes, algumas simples como mostrar um resultado na tela para o usuário, outras tão complexas quanto ordenar uma lista \
de contatos por ordem alfabética. Algumas precisam ser construídas, outras vem prontas na <strong>linguagem de programação</strong>.</p>\
<p>Linguagens de programação são "idiomas" usados para enviar as instruções para o computador. Elas variam de complexidade e poder, e atendem \
à todos os gostos. Elas também servem para diferentes propósitos, algumas criadas para atender uma única necessidade, como o controle do maquinário \
uma fábrica, outras com propósito geral, podendo ser usadas desde comunicação com sensores em hardware até produzir páginas para a Web. \
No futuro, discutiremos sobre diferentes tipos de linguagens, de compiladas à interpretadas, de imperativas à declarativas. \
Por hora, basta saber que utilizaremos neste curso a linguagem JavaScript, que está presente em todos os browsers modernos. \
Começaremos aprendendo as bases da programação e exercitando o raciocínio lógico, depois entrando em técnicas mais avançadas, \
para então experimentarmos usos mais práticos dos conhecimentos adquiridos.</p>\
<p>Execute o código abaixo e veja em ação o programa <i>cliché</i> que é comumente o primeiro a ser executado em uma nova linguagem \
que se está aprendendo ou desenvolvendo.</p>\
        '
      },

      {
        title: "0.2 - Zeros e Uns",
        hideCode: true,
        explanation: '\
<p>É comum a cultura popular referenciar programas de computador como feitos apenas com 0s e 1s. Isto é, de certa forma, verdade. \
A unidade básica que o computador compreende é o <strong>bit</strong>, o qual pode ser armazenado em diversas peças de hardware, e \
pode possuir apenas um de dois valores: desligado (0) e ligado (1). O assunto de como o computador traduz as sequências de bits em \
instruções e valores úteis foge do escopo deste curso, mas um resumo simples é que, no caso de valores numéricos, nossos números no \
sistema decimal (contam-se 10 números entre cada "vai um") são convertidos para o sistema binário (contam-se 2 números entre cada \
"vai um"). Por exemplo:</p>\
<table class="table">\
  <thead>\
    <tr>\
      <td>Decimal (base 10)</td>\
      <td>Binário (base 2)</td>\
    </tr>\
  </thead>\
  <tbody>\
    <tr>\
      <td>1</td>\
      <td>0001</td>\
    </tr>\
    <tr>\
      <td>2</td>\
      <td>0010</td>\
    </tr>\
    <tr>\
      <td>3</td>\
      <td>0011</td>\
    </tr>\
    <tr>\
      <td>4</td>\
      <td>0100</td>\
    </tr>\
    <tr>\
      <td>5</td>\
      <td>0101</td>\
    </tr>\
    <tr>\
      <td>6</td>\
      <td>0110</td>\
    </tr>\
    <tr>\
      <td>7</td>\
      <td>0111</td>\
    </tr>\
    <tr>\
      <td>8</td>\
      <td>1000</td>\
    </tr>\
<p>Para o caso de instruções, existem tabelas de tradução. Poderíamos supor, por exemplo, que a sequência de bits <code>0001</code> signifique soma, e \
que <code>0001 0010 0001 1000</code> signifique some (<code>0001</code>) 2 (<code>0010</code>) e 1 (<code>0001</code>) e \
armazene o resultado na posição de memória 8 (<code>1000</code>). Na verdade, as instruções costumam ser muito mais complexas, \
mas este exemplo ilustra seu funcionamento básico. São dependentes do hardware, que executa-as através de operações lógicas que \
também não abordaremos neste curso. De mesmo modo, os caracteres (letras minúsculas, maiúsculas, acentuadas, ponto, vírgula, etc.) \
são traduzidos através de tabelas, como a <a href="http://sticksandstones.kstrom.com/appen.html">ASCII</a>.</p>\
<p>A moral da história é que, embora os computadores compreendam apenas 0s e 1s, raramente os programadores tem que trabalhar \
com estes valores. Através de traduções sucessivas, é possível escrever em níveis cada vez mais altos, mais próximos da linguagem \
humana, em linguagens mais expressivas. A palavra "expressiva" aqui significa "contendo mais significado em um menor número de caracteres, ser \
capaz de fazer mais coisas escrevendo menos" (<a href="http://blog.revolutionanalytics.com/2012/11/which-programming-language-is-the-most-concise.html">\
tabela comparativa entre expressividade de diferentes linguagens</a>). Uma boa forma de visualizar essas diferenças é ver o quanto \
<a href="http://en.wikipedia.org/wiki/List_of_Hello_world_program_examples">pode variar o programa Hello World visto anteriormente</a>. \
Estas "camadas" de tradução, que permitem o aumento na expressividade, são as principais responsáveis pelos grandes avanços na programação,</p>\
  </tbody>\
</table>\
        '
      },

      {
        title: "0.3 - Algoritmos",
        prefill: '\
function maior(lista) {\n\
  var maior = lista[0];\n\
  for (var i = 1; i < lista.length; i++) {\n\
    if (lista[i] > maior) {\n\
      maior = lista[i];\n\
    }\n\
  }\n\
  return maior;\n\
}\n\
input = prompt("Digite uma lista de números inteiros separados por vírgula. Por exemplo: 15, 23, 94, 1, 32, -24");\n\
numeros = input.split(",").map(function(numero) { return parseInt(numero); });\n\
alert("O maior número da lista dada é: " + maior(numeros));\n\
        ',
        explanation: '\
<p>Para finalizar esta seção introdutória, é relevante mencionar o conceito de algoritmos. Um algoritmo consiste de uma sequência <strong>ordenada</strong> \
e <strong>finita</strong> de passos que solucionam um problema específico. É comum comparar algoritmos à uma receita de bolo, embora possam ser muito mais \
complexos. Também é importante ressaltar a palavra <strong>finita</strong>, uma vez que um programa que execute indefinidamente não pode ser considerado um algoritmo \
(embora sejam tão importantes quanto; um sistema operacional é um bom exemplo). Dentro de alguns capítulos, você irá experimentar algoritmos de vários níveis de \
complexidade, com vários objetivos.</p>\
<p>Para fins ilustrativos, segue abaixo um programa que utiliza um algoritmo simples para identificar o maior valor dentro de uma lista. Após alguns capítulos, você \
irá compreender e escrever programas como este.</p>\
        '
      }
    ]
  },

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
<p>O operador <code>!</code> é unário (aplica-se sobre um único operando), e representa negação, ou seja, inverte o valor booleano. Segue abaixo uma tabela que\
representa essas transformações:</p>\
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
<p>Para se acessar o valor de uma variável, basta chamar seu nome (ou <strong>identificador</strong>): <code>nomeDaVariavel</code>. Chamar um identificador não existente \
ocasiona um erro: <code>ReferenceError: teste is not defined</code>. O nome de uma variável precisa \
seguir algumas regras: deve ser iniciado por uma letra ou caracter especial permitido (em JavaScript, são <code>_</code> e <code>$</code>), \
e depois zero ou mais letras, caracteres especiais permitidos e números \
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
<p>Execute o código abaixo. Para passar neste exercício, altere o código para que a variável <code>nome</code> <strong>termine</strong> a execução com o valor "Daniel". \
Também é interessante experimentar remover as linhas contendo atribuições e verificar o erro produzido pela chamada à um identificador inexistente.</p>\
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
i = i + 1;\n\
i = i - 1;\n\
i = i / 2;\n\
i = i + 2;\n\
i = i * 2;\n\
i = i % 2;\n\
i = i - 1;\n\
alert(i);\n\
        ',
        answer: '\
var i = 10;\n\
i++;\n\
i -= 2;\n\
i /= 2;\n\
i += 2;\n\
i *= 2;\n\
i %= 2;\n\
i--;\n\
alert(i);\n\
        ',
        explanation: '\
<p>A sequência <code>variavel = variavel [operador] outraVariavel</code> é extremamente comum em programação, tanto que foram criados atalhos: \
<code>a += 1</code>, <code>a *= 2</code>, <code>a -= 1</code>, <code>a /= 2</code> e <code>a %= 2</code> são todos comandos válidos e equivalentes à sequência \
mostrada, com os respectivos operadores. A expressão <code>saudacoes += " Daniel!"</code> também funciona como se esperaria em relação à strings. \
Além disso, para um dos casos mais comuns de todos, o <strong>incremento</strong> (adição de 1) e <strong>decremento</strong> (subtração de 1) podem \
ser reduzidos, respectivamente, à <code>variavel++</code> e <code>variavel--</code>.</p>\
<p>Isto conclui o assunto sobre variáveis e seus operadores. Ainda existem alguns operadores especiais, utilizados para operações com números binários, que não serão \
abordados por enquanto. No exemplo a seguir, conserte o código dado para utilizar as respectivas versões simplificadas.</p>\
        '
      },

      {
        title: "1.9 - Extra: Legibilidade",
        hideCode: true,
        explanation: '\
<p>Este curso foi iniciado explicando o significado básico de programação. Este capítulo extra é o primeiro de uma série que aprofunda o sentido da palavra \
programar, ampliando-o além do funcional, explicando as múltiplas responsabilidades e habilidades que um programador deve ter. Iniciaremos falando sobre \
legibilidade.</p>\
<p>Enquanto estiver escrevendo um código, você deve ter sempre em mente que não está escrevendo para si próprio, mas para outras pessoas. Isto é verdade \
tanto se você trabalhar dentro de uma equipe quanto sozinho: seu "eu" do futuro vai agradecer profundamente quando tiver que mexer num código de 3 meses atrás. \
Para isso, um passo básico é manter os nomes das variáveis o mais legível possíveis. Eles devem ser descritivos e claros sobre o tipo de valor contido e/ou função exercida \
dentro do código. Ou seja, evite nomes de variáveis como <code>var x</code>, <code>var x2</code> e <code>var teste</code>, <strong>a não ser</strong> que sejam parte \
do domínio do problema (x seria pertinente à um problema matemático, por exemplo) ou que você esteja fazendo uma <a wip>prototipagem</a> rápida, e não pretenda reutilizar \
aquele código. Se estiver escrevendo um programa que armazene o nome de um usuário, use uma variável <code>var nome</code>, ou se houver outros tipos de nome dentro do \
programa, use <code>var nomeUsuario</code> para evitar ambiguidades. Também é recomendado, embora nem sempre possível, utilizar nomes em inglês, tanto para ficar \
em conformidade com o resto da linguagem de programação, quanto pela grande maioria dos programadores fazer o mesmo. Este curso não utiliza esta recomendação para \
evitar uma possível barreira linguística ao aprendizado.</p>\
<p>Existem dois estilos bem aceitos de se separar palavras dentro do nome de uma variável: camelCase e snake_case. No camelCase, como o próprio nome indica, palavras \
são diferenciadas através de uma letra maiúscula no início de cada uma; no snake_case (ex: nomeDoUsuario), são separadas por <i>underscore</i> (ex: nome_do_usuario). \
O estilo preferido por programadores JavaScript é o camelCase, e é aconselhável seguir os padrões da comunidade, tanto para facilitar sua compreensão ao ler exemplos \
de outras pessoas quanto para manter seu código de mais fácil manutenção por outros.</p>\
<p>Sobre o valor armazenado pela variável, embora a linguagem JavaScript permita que seu tipo seja mudado durante o decorrer do programa, isto não é aconselhável. \
Uma vez inicializada com um tipo de valor, a variável deve não apenas ser utilizada apenas para o propósito explicitado por seu nome, mas também não deve mudar o tipo do \
valor contido dentro dela. Por exemplo:</p>\
<pre><code>\
var numeroUsuarios = 0;\n\
// Cálculando o número de usuários\n\
numeroUsuarios = "O número total de usuários é: " + numeroUsuarios;\n\
alert(numeroUsuarios);\n\
</code></pre>\
<p>O correto seria criar uma nova variável <code>mensagemNumeroUsuarios</code> ou passar a string diretamente para a função <code>alert</code>.</p>\
<p>Sobre o tamanho e especificidade dos identificadores, há duas principais filosofias: descrever o mais especificamente possível, por exemplo <code>\
nomeDigitadoDoUsuario</code>, e o menos possível dentro do contexto, por exemplo, caso não haja outro nome dentro do programa senão o do usuário, apenas <code>nome</code>.</p>\
<p>Por fim, sobre o ato de atribuir um valor à uma variável, repare que sempre utilizamos um ponto-e-vírgulo ao final da linha. Isto <strong>não</strong> é \
obrigatório, mas é recomendado. Atribuir um valor à uma variável, assim como várias outras operações, é uma <strong>instrução</strong> (ou <strong>statement</strong>), \
e o programa que executa o código JavaScript compreende que uma quebra de linha significa (em geral, <i class="troll" />) uma instrução diferente. Para se \
utilizar mais de uma instrução em uma mesma linha, é possível utilizar o ponto-e-vírgula: <code>nome = "Marcos"; i = 0;</code>. A recomendação de se utilizar \
sempre o ponto-e-vírgula deriva da função para a qual o JavaScript foi criado: uma linguagem para ser executada no browser de um usuário. Para isso, deve ser feito \
o <i>download</i> do código, e quanto mais caracteres, maior o tamanho do arquivo a ser baixado. Portanto, é comum utilizar programas que removem quebras de linha, e \
até modificam os nomes de variáveis e funções, de forma a compactar o código original até uma versão de funcionamento idêntico, porém com menos caracteres. Dessa \
forma, é recomendado utilizar os pontos-e-vírgulas, uma vez que as quebras de linha serão removidas.</p>\
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
<p>Assim como variáveis permitem reutilizar valores, funções permitem reutilizar <strong>statements</strong> (ver <a href="#valuesAndOperators_8">1.9 - Extra: Legibilidade</a>). \
Uma função é um conjunto de 1 ou mais statements que possui um nome (ou identificador), e pode ser executada em qualquer lugar ao chamá-lo. \
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
uma das linguagens mais versáteis existentes! De mesma forma, as recomendações de legibilidade e nomenclatura para identificadores de variáveis são aplicáveis à funções. \
Agora que temos uma função declarada, como fazemos para executar o código dela? Basta chamar seu nome seguido de \
parênteses: <code>notificar()</code>. Assim como variáveis, chamar o nome de uma função é como tirar ela de dentro da caixa. Os parênteses funcionam como uma ordem: \
pegue isso que eu acabei de tirar da caixa e execute-o.</p>\
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
function divisivel(dividendo, divisor) {\n\
  return dividendo % divisor == 0;\n\
}\
        ',
        prefill: 'function divisivel(dividendo, divisor) {\n}',
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
      },

      {
        title: "2.4 - Extra: Refatoração e DRY",
        prefill: '\
function funcionario(registro) {\n\
  return registro.split("-")[0].trim() == "FUNCIONÁRIO"\n\
}\n\
\n\
function gerente(registro) {\n\
  return registro.split("-")[0].trim() == "GERENTE"\n\
}\n\
\n\
function supervisor(registro) {\n\
  return registro.split("-")[0].trim() == "SUPERVISOR"\n\
}\n\
\n\
function salario(registro) {\n\
  if (funcionario(registro)) {\n\
    return 2000;\n\
  } else if (gerente(registro)) {\n\
    return 3000;\n\
  } else if (supervisor(registro)) {\n\
    return 4000;\n\
  } else {\n\
    alert("Tipo não encontrado: " + registro.split("-")[0].trim());\n\
  }\n\
}\n\
\n\
function descrever(registro) {\n\
  var nome = registro.split("-")[1].trim();\n\
  alert("O salário do empregado " + nome + " é " + salario(registro));\n\
}\n\
\n\
descrever("FUNCIONÁRIO - Daniel Rodrigues");\n\
        ',
        answer: '\
function separar(registro) {\n\
  return registro.split("-");\n\
}\n\
\n\
function campo(registro, indice) {\n\
  return separar(registro)[indice].trim();\n\
}\n\
\n\
function cargo(registro) {\n\
  return campo(registro, 0);\n\
}\n\
\n\
function nome(registro) {\n\
  return campo(registro, 1);\n\
}\n\
\n\
function funcionario(registro) {\n\
  return cargo(registro) == "FUNCIONÁRIO"\n\
}\n\
\n\
function gerente(registro) {\n\
  return cargo(registro) == "GERENTE"\n\
}\n\
\n\
function supervisor(registro) {\n\
  return cargo(registro) == "SUPERVISOR"\n\
}\n\
\n\
function salario(registro) {\n\
  if (funcionario(registro)) {\n\
    return 2000;\n\
  } else if (gerente(registro)) {\n\
    return 3000;\n\
  } else if (supervisor(registro)) {\n\
    return 4000;\n\
  } else {\n\
    alert("Tipo não encontrado: " + cargo(registro)));\n\
  }\n\
}\n\
\n\
function descrever(registro) {\n\
  alert("O salário do empregado " + nome(registro) + " é " + salario(registro));\n\
}\n\
\n\
descrever("FUNCIONÁRIO - Daniel Rodrigues");\n\
        ',
        explanation: '\
<p>Uma das tarefas mais importantes que um programador deve realizar é a refatoração. Este é um jargão derivado da palavra em inglês <i>refactoring</i>, e é uma \
técnica para melhorar o projeto (ou <i>design</i>) de um código. Consiste de realizar uma série de pequenas mudanças que <strong>não</strong> alteram o funcionamento \
do programa, mas cujo efeito cumulativo resultam num programa muito mais manutenível e legível. Por exemplo, digamos que precisemos de duas funções, uma chamada \
<code>par</code> e outra <code>impar</code>, que retornam um valor booleano respondendo se um argumento passado é par ou ímpar, respectivamente. Uma solução \
inocente seria:</p>\
<pre><code>\
function par(x) {\n\
  return x % 2 == 0;\n\
}\n\
\n\
function impar(x) {\n\
  return x % 2 != 0;\n\
}\n\
</code></pre>\
<p>Porém, observando o código das duas funções, percebemos que é praticamente idêntico. De fato, implementamos no exercício anterior a função <code>divisivel</code>, \
que pode ser utilizado para se reduzir a repetição do exemplo acima:</p>\
<pre><code>\
function divisivel(dividendo, divisor) {\n\
  return dividendo % divisor == 0;\n\
}\n\
\n\
function par(x) {\n\
  return divisivel(x, 2);\n\
}\n\
\n\
function impar(x) {\n\
  return !divisivel(x, 2);\n\
}\n\
</code></pre>\
<p>Mais que isso, podemos ver que a função <code>impar</code> é o exato oposto da <code>par</code>, ou seja, quando <code>par(x)</code> for <code>true</code>, \
<code>impar(x)</code> será <code>false</code>, sem excessões. Sendo assim, podemos reescrevê-la como:</p>\
<pre><code>\
function impar(x) {\n\
  return !par(x);\n\
}\n\
</code></pre>\
<p>Repare que fizemos duas pequenas modificações, e nenhuma delas alterou o comportamento do código: <code>par(x)</code> mantém o mesmo resultado para qualquer \
<code>x</code> antes e depois da refatoração. São códigos <strong>equivalentes</strong>, mas o segundo denota muito mais claramente seu funcionamento: um número é \
par se for divisível por 2, e é ímpar se não for par.</p>\
<p>Além da melhoria na legibilidade, o exemplo acima demonstra o princípio DRY &ndash; <i>Don\'t Repeat Yourself</i> (Não Se Repita) &ndash; que busca reduzir \
a repetição de código dentro de um sistema. O princípio pode ser dito como: "Todo pedaço de conhecimento deve ter uma única, não-ambígua, autoritativa representação \
dentro de um sistema". Dentro de nosso exemplo, temos uma única representação para o conhecimento de se um número é divisível por outro &ndash; a \
função <code>divisivel</code> &ndash;, e uma única representação para o conhecimento de se um número é par &ndash; a função <code>par</code>. \
A maior vantagem desta prática é evitar inconsistências dentro do código. Embora a definição matemática de número par dificilmente será mudada, \
muitos pedaços de software são frequentemente alterados. Por exemplo, em um jogo, \
um jogador pode ser considerado vitorioso caso tenha mais pontos ao final da partida. Após algum tempo, as regras podem mudar: ele apenas será vitorioso se tiver mais \
pontos E tiver obtido alguns itens essenciais ao longo da partida. Imagine se tivéssemos que alterar essa regra em diversos locais diferentes? É muito mais fácil \
caso tenhamos uma função <code>checarVitoria</code>, utilizada ao longo do código.</p>\
<p>No exercício abaixo, foi escrita uma função que recebe um registro de empregado (provavelmente de algum arquivo ou banco de dados), e diz qual seu salário baseado \
em seu cargo. A função <code>split(separador)</code> utilizada é "pertencente" às strings (mais sobre funções que pertencem à valores em <a wip>Objetos e Propriedades</a>), e \
separa a string em uma lista de valores (ver <a wip>Listas</a>) nos locais em que for encontrada a string passada como argumento, nesse caso <code>"-"</code>. \
A função <code>trim()</code>, também pertencente às strings, remove os espaços em branco à esquerda e à direita da string, ou seja, "  uma string qualquer " vira \
"uma string qualquer". Portanto, <code>"FUNCIONÁRIO - Daniel Rodrigues".split("-")[0]</code> resulta na string <code>"FUNCIONÁRIO"</code>, e \
<code>"FUNCIONÁRIO - Daniel Rodrigues".split("-")[1].trim()</code> resulta em <code>"Daniel Rodrigues"</code>. Pede-se que refatore o código, \
eliminando a repetição e tornando-o mais legível. Embora neste exercício sejam utilizados muitos conhecimentos \
ainda não ensinados, o foco deve ser na remoção da repetição; o aluno deve considerar que o código é válido, ainda que não compreenda completamente seu funcionamento.</p>\
        '
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
          { src: "fibonacci(0);", expected: 0 },
          { src: "fibonacci(1);", expected: 1 },
          { src: "fibonacci(2);", expected: 1 },
          { src: "fibonacci(3);", expected: 2 },
          { src: "fibonacci(4);", expected: 3 },
          { src: "fibonacci(5);", expected: 5 },
          { src: "fibonacci(6);", expected: 8 },
          { src: "fibonacci(7);", expected: 13 },
          { src: "fibonacci(8);", expected: 21 },
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
<p>Preencha a função <code>fibonacci</code> abaixo com o algoritmo que retorna o número na posição informada da \
<a target="_blank" href="http://pt.wikipedia.org/wiki/Sequ%C3%AAncia_de_Fibonacci">Sequência de Fibonacci</a>. Esta sequência é iniciada com 0 e 1, \
e o resto dos números é gerado somando-se os dois números anteriores na sequência <strong>infinitamente</strong>. Por exemplo: \
<code>0, 1, (1 + 0 == 1), (1 + 1 == 2), (2 + 1 == 3), (3 + 2 == 5), (5 + 3 == 8), (8 + 5 == 13), (13 + 8 == 21), ...</code>. \
Como não é plausível gerar uma sequência infinita de números, pedimos que gere apenas o \
número na posição passada como parâmetro. Por exemplo:</p>\
<pre><code>\
fibonacci(0) == 0;\n\
fibonacci(1) == 1;\n\
fibonacci(2) == 1;\n\
fibonacci(3) == 2;\n\
fibonacci(4) == 3;\n\
fibonacci(5) == 5;\n\
fibonacci(6) == 8;\n\
fibonacci(7) == 13;\n\
fibonacci(8) == 21;\n\
</code></pre>\
<p>Para facilitar, os casos finais da recursão já estão preenchidos; falta apenas a redução.</p>\
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
para ele, o qual será explicado em <a wip>Repetição definida: for</a>. Também vale ressaltar que a variável <code>i</code> foge às recomendações sobre \
identificadores descritivos. Este é um caso especial, pois <code>i</code> é comumente utilizada como variável contendo o <strong>índice</strong> atual \
em uma iteração; é uma convenção. É um caso análogo às variáveis convencionadas da física, como <code>m</code> para massa e <code>F</code> para força. \
O que podemos perceber nas soluções apresentadas é que perde-se a \
elegância da recursividade, em que se aborda casos simples e a redução até os mesmos através da mudança de contexto, e passa-se a controlar a execução \
através de alguma estrutura de controle. É encorajado que, quando se deparar com algum problema difícil, busque-se uma solução recursiva, em geral mais \
simples de se obter, para depois convertê-la para o método iterativo uma vez que se prove correta.</p>\
<p>Neste exercício, você deverá transformar a função <code>fibonacci</code>, vista no exercício passado, para o método iterativo. Fica a lembrança: será necessário \
armazenar o contexto atual e atualizá-lo através de alguma estrutura de controle, ao invés de simplesmente realizar a redução à casos mais simples da recursão.</p>\
        '
      },

      {
        title: "3.6 - Extra: Corretude",
        hideCode: true,
        explanation: '\
<p>Um programador às vezes precisa escrever códigos consideravelmente complexos, principalmente algoritmos, os quais são de difícil compreensão, ainda que sejam \
aplicadas todas as boas práticas e recomendações. O exercício anterior é um bom exemplo; não importa o quão experiente seja o programador, caso ele se depare com \
um código daquele nível de complexidade, precisará realizar uma execução mental do código, passo-a-passo, sobre diferentes valores.</p>\
<p>Executar sempre seu código mentalmente, possivelmente escrevendo em um papel os resultados de cada passo, é uma prática essencial para garantir sua corretude, \
uma vez que programar é uma atividade com <strong>intento</strong>. \
Escrever ou copiar linhas semi-aleatórias de código até obter o resultado desejado é <a href="https://pragprog.com/the-pragmatic-programmer/extracts/coincidence">\
Programar por Coincidência</a>. Dificilmente o programa resultante será o mais correto, conciso e legível possível. Além de ser útil ao escrever o algoritmo, \
é um exercício que facilita bastante a <strong>depuração</strong>, ou <strong>debugging</strong>.</p>\
<p>Algo que deve ser levado em consideração são <strong>quais argumentos testar</strong>, uma vez que não é prático nem útil testar indefinidos valores de entrada. \
Também não é aconselhável executar todas as iterações de um valor de entrada grande (por exemplo, <code>fibonacci(100);</code>). É útil \
considerar a mesma técnica usada em algoritmos recursivos: identificar os casos finais, ou de borda (<i>edge cases</i>), e o caso comum. Isto significa executar \
o código para os valores que estejam inclusos dentro das condições de término do algoritmo, e pelo menos uma vez para o caso recursivo, garantindo que este \
decai para os casos de borda eventualmente e corretamente.</p>\
<p>Esta é apenas uma de várias técnicas para garantir a corretude do código. Poderia ser chamada de <strong>Verificação por Inspeção</strong>. Existem \
outras técnicas, como <strong>Testes Automatizados</strong>, inclusive algumas que misturam teste e design, por exemplo ao escrever o teste antes mesmo do código. \
Esta, conhecida como <i>Test-driven development</i> (TDD), é extremamente útil e será vista em mais detalhes no capítulo sobre <a wip>Testes</a>.</p>\
        '
      }
    ]
  },

  {
    key: "simpleDataStructures",
    title: "4 - Estruturas de Dados Simples",
    exercises: [
      {
        title: "4.1 - Listas",
        prefill: '\
function divisivel(dividendo, divisor) {\n\
  return dividendo % divisor == 0;\n\
}\n\
\n\
function primo(x) {\n\
}\n\
\n\
function contarPrimos(numeros) {\n\
}\n\
\n\
var numeros = [10, 2, 5, 13, 27];\n\
contarPrimos(numeros);\n\
        ',
        answer: '\
function divisivel(dividendo, divisor) {\n\
  return dividendo % divisor == 0;\n\
}\n\
\n\
function primo(x) {\n\
  if (x < 2) {\n\
    return false;\n\
  }\n\
  var i = 2;\n\
  while (i <= x / 2) {\n\
    if (divisivel(x, i)) {\n\
      return false;\n\
    }\n\
    i++;\n\
  }\n\
  return true;\n\
}\n\
\n\
function contarPrimos(numeros) {\n\
  var i = 0;\n\
  var quantidade = 0;\n\
  while (i < numeros.length) {\n\
    if (primo(numeros[i])) {\n\
      quantidade++;\n\
    }\n\
\n\
    i++;\n\
  }\n\
  return quantidade;\n\
}\n\
\n\
var numeros = [10, 2, 5, 13, 27];\n\
contarPrimos(numeros);\n\
        ',
        testCases: [
          { src: "primo(1)", expected: false },
          { src: "primo(4)", expected: false },
          { src: "primo(5)", expected: true },
          { src: "contarPrimos([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);", expected: 4 },
          { src: "contarPrimos([]);", expected: 0 },
          { src: "contarPrimos([0, 1]);", expected: 0 },
          { src: "contarPrimos([2, 3, 5, 7, 13]);", expected: 5 }
        ],
        explanation: '\
<p>Até este momento você já esbarrou em listas duas vezes, e talvez tenha adivinhado como funcionam. Suas utilidades são inúmeras, e conhecer seu funcionamento \
abre as portas para uma série de novas aplicações. Basicamente, uma <strong>lista</strong>, <strong>vetor</strong> ou <strong>array</strong> é uma estrutura de dados \
contendo uma sequência ordenada de valores. Por exemplo: <code>var nomes = ["Marcos", "Lucas", "Daniel"];</code> inicializa a variável <code>nome</code> \
com a lista de strings dada. \
Para acessar o valor em qualquer posição, basta indicá-la entre colchetes: <code>nomes[0] == "Marcos"; nomes[1] == "Lucas"; nomes[2] == "Daniel";</code>. Como \
pode perceber, a primeira posição de um array é zero, e a última é o número de elementos menos 1. Dessa forma, podemos percorrer os elementos do array da seguinte \
forma (execute mentalmente o código abaixo e confirme sua corretude):</p>\
<pre><code>\
var nomes = ["Marcos", "Lucas", "Daniel"];\n\
var i = 0;\n\
while (i < nomes.length) {\n\
  var nome = nomes[i];\n\
  alert("O nome na posição " + i + " é " + nome);\n\
  i++;\
}\n\
</code></pre>\
<p>Repare que utilizamos uma variável especial <code>nomes.length</code>. Esta variável, ou <strong>propriedade</strong>, existe dentro de qualquer array, e será \
melhor explicada em breve em <a wip>Objetos</a>. Basta saber que ela sempre contém o número exato de elementos da lista.</p>\
<p>Em algumas linguagens de programação é permitido apenas armazenar um tipo de valor dentro de um array. Ou seja, um array de strings nunca poderá conter um número. \
Em JavaScript, <code>var usuario = ["Marcos", 26]; // usuario[0] é o nome, usuário[1] é a idade</code> é uma instrução válida. De fato, existe uma variável especial \
dentro de cada função chamada <code>arguments</code>, cujo valor é um array contendo todos os argumentos passados para ela, <strong>mesmo aqueles não capturados pelos \
parâmetros</strong>:</p>\
<pre><code>\
function listarArgumentos(parametro) {\n\
  var i = 0;\n\
  while (i < arguments.length) {\n\
    alert(arguments[i]);\n\
    i++;\n\
  }\n\
}\n\
\n\
listarArgumentos();\n\
listarArgumentos(1);\n\
listarArgumentos(1, 2);\n\
</code></pre>\
<p>Embora seja permitido, não é recomendável armazenar diferentes tipos de valores dentro de um array. Isso cria a necessidade de um "contrato" garantindo quais \
informações estão em quais posições. Ou seja, no exemplo <code>var usuario = ["Marcos", 26]</code>, cria-se um vínculo entre a posição 0, contendo o "nome", e a \
posição 1, contendo a "idade". Isto, além de ser propenso à inconsistências devido à mudanças (imagine se fosse preciso inserir um novo campo "data de nascimento" \
na primeira posição do array?), é uma má utilização de uma estrutura de dados cujo objetivo primário é <strong>listar</strong> coisas, e não <strong>descrever</strong> \
coisas. Você verá uma estrutura mais apropriada à descrições em <a wip>Objetos</a>.</p>\
<p>No exercício abaixo, você deverá implementar a função <code>contarPrimos</code>, que conta a quantidade de números primos dentro de uma lista qualquer de números. \
Você também precisará implementar a função <code>primo</code>, que recebe um número qualquer e retorna <code>true</code> apenas se ele for primo. Relembrando um pouco de \
matemática, um número primo é um número inteiro <strong>maior que 1</strong>, divisível <strong>apenas</strong> por 1 e ele mesmo (2, 3, 5, 7, 13, etc.). Dica: um número \
<strong>nunca</strong> é divisível por um número <strong>maior que a metade de seu valor</strong> (por exemplo, no caso de 13, basta testar se é divisível até \
6, pois 7 já passa de sua metade).</p>\
        '
      },

      {
        title: "4.2 - Alterando listas",
        prefill: '\
function push(lista, elemento) {\n\
}\n\
\n\
function remover(lista, elemento) {\n\
}\n\
        ',
        answer: '\
function push(lista, elemento) {\n\
  var novaLista = [];\n\
  var i = 0;\n\
  while (i < lista.length) {\n\
    novaLista[novaLista.length] = lista[i];\n\
    i++;\n\
  }\n\
  novaLista[novaLista.length] = elemento;\n\
\n\
  return novaLista;\n\
}\n\
\n\
function remover(lista, elemento) {\n\
  var novaLista = [];\n\
  var i = 0;\n\
  while (i < lista.length) {\n\
    if (lista[i] != elemento) {\n\
      novaLista[novaLista.length] = lista[i];\n\
    }\n\
    i++;\n\
  }\n\
\n\
  return novaLista;\n\
}\n\
        ',
        testCases: [
          { src: "JSON.stringify(push([1, 2], 3));", expected: "[1,2,3]" },
          { src: "JSON.stringify(remover([1, 2], 2));", expected: "[1]" },
          { src: "var lista = [1, 2]; push(lista, 3); JSON.stringify(lista);", expected: "[1,2]" },
          { src: "var lista = [1, 2]; remover(lista, 2); JSON.stringify(lista);", expected: "[1,2]" }
        ],
        explanation: '\
<p>Obter apenas listas prontas não é muito útil na vida real: com frequência não sabemos com antecedência quantos e quais elementos entrarão na lista, além de precisar \
atualizá-la durante a execução do programa. Para inserir novos elementos no final da lista, arrays possuem uma função chamada <code>lista.push(elemento)</code>. \
No exemplo anterior, se ao invés de apenas contar quantos primos há numa lista quiséssemos retornar uma nova lista contendo apenas os primos contidos, poderíamos \
usar a função abaixo:</p>\
<pre><code>\
function selecionarPrimos(numeros) {\n\
  var primos = [];\n\
  var i = 0;\n\
  while (i < numeros.length) {\n\
    var numero = numeros[i];\n\
    if (primo(numero)) {\n\
      primos.push(numero);\n\
    }\n\
    i++;\n\
  }\n\
\n\
  return primos;\n\
}\n\
</code></pre>\
<p>Uma forma de compreender como funciona a função <code>push</code> é observar o código análogo abaixo:</p>\
<pre><code>\
function push(lista, elemento) {\n\
  lista[lista.length] = elemento;\n\
}\n\
\n\
function selecionarPrimos(numeros) {\n\
  var primos = [];\n\
  var i = 0;\n\
  while (i < numeros.length) {\n\
    var numero = numeros[i];\n\
    if (primo(numero)) {\n\
      push(primos, numero);\n\
    }\n\
    i++;\n\
  }\n\
\n\
  return primos;\n\
}\n\
</code></pre>\
<p>O exemplo acima também serve para ilustrar a <strong>passagem por referência</strong>, a qual será explicada em mais detalhes em <a wip>Referências</a>. \
Por enquanto, basta saber que a lista recebida como parâmetro pode sofrer alterações dentro da função, e estas alterações permanecerão. É diferente do que \
aconteceria se fosse feita uma <stron>cópia</strong> da lista.</p>\
<p>Embora hajam funções que facilitem a manipulação de listas, no exercício abaixo vamos implementar duas operações básicas para treinar suas habilidades em \
escrever algoritmos: <code>push(lista, elemento)</code> insere o elemento no final da lista e <code>remover(lista, elemento)</code> remove da lista o elemento passado. \
Mas atenção, as funções <code>push</code> e <code>remover</code> <strong>NÃO</strong> \
devem alterar o estado da lista original, ou seja, precisam retornar uma nova lista. Por exemplo:</p>\
<pre><code>\
var lista = [1, 2, 3, 4];\n\
\n\
var novaLista = push(lista, 5);\n\
novaLista == [1, 2, 3, 4, 5];\n\
lista == [1, 2, 3, 4];\n\
\n\
novaLista = remover(lista, 1);\n\
novaLista == [2, 3, 4];\n\
lista == [1, 2, 3, 4];\n\
</code></pre>\
        '
      }
    ]
  }
]);
