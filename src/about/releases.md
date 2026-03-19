---
outline: deep
---

<script setup>
import { ref, onMounted } from 'vue'

const version = ref()

onMounted(async () => {
  const res = await fetch('https://api.github.com/repos/vuejs/core/releases/latest')
  version.value = (await res.json()).name
})
</script>

# Wydania {#releases}

<p v-if="version">
Aktualnie najnowsza stabilna wersja Vue to <strong>{{ version }}</strong>.
</p>
<p v-else>
Sprawdzanie najnowszej wersji...
</p>

Pełny changelog poprzednich wydań jest dostępny na [GitHub](https://github.com/vuejs/core/blob/main/CHANGELOG.md).

## Cykl wydań {#release-cycle}

Vue nie ma ustalonego cyklu wydań.

- Wydania poprawkowe (patch releases) są wydawane w razie potrzeby.

- Wydania mniejsze (minor releases) zawsze zawierają nowe funkcje, a typowy czas pomiędzy nimi wynosi 3-6 miesięcy. Mniejsze wydania zawsze przechodzą przez fazę beta.

- Wydania główne (major releases) będą ogłaszane z wyprzedzeniem i przejdą przez wczesną fazę dyskusji oraz fazy alpha/beta.

## Przypadki brzegowe wersjonowania semantycznego {#semantic-versioning-edge-cases}

Wydania Vue są zgodne z [wersjonowaniem semantycznym](https://semver.org/), jednak istnieje kilka przypadków brzegowych.

### Definicje TypeScript {#typescript-definitions}

Możemy dostarczać niekompatybilne zmiany w definicjach TypeScript między wersjami **mniejszymi**. Dzieje się tak, ponieważ:

1. Czasami sam TypeScript wprowadza niekompatybilne zmiany między wersjami mniejszymi, co zmusza nas do dostosowania typów, aby wspierać nowsze wersje TypeScript.

2. Sporadycznie musimy przyjąć funkcje, które są dostępne tylko w nowszej wersji TypeScript, co podnosi minimalną wymaganą wersję TypeScript.

Jeśli używasz TypeScript'a, możesz użyć zakresu semver, który blokuje obecną wersję mniejszą, i ręcznie aktualizować, gdy zostanie wydana nowa mniejsza wersja Vue.

### Zgodność skompilowanego kodu ze starszym środowiskiem wykonawczym{#compiled-code-compatibility-with-older-runtime}

Nowsza **mniejsza** wersja kompilatora Vue może generować kod, który nie jest zgodny z środowiskiem wykonawczym Vue ze starszej wersji mniejszej. Na przykład, kod wygenerowany przez kompilator Vue 3.2 może nie być w pełni kompatybilny, jeśli jest używany przez środowisko wykonawcze z Vue 3.1.

Jest to problem tylko dla autorów bibliotek, ponieważ w aplikacjach wersja kompilatora i wersja środowiska wykonawczego są zawsze takie same. Niezgodność wersji może wystąpić tylko wtedy, gdy dostarczasz skompilowany kod komponentu Vue jako paczkę, a użytkownik używa go w projekcie z starszą wersją Vue. W rezultacie paczka może wymagać jawnego zadeklarowania minimalnej wymaganej mniejszej wersji Vue.

## Wstępne wydania {#pre-releases}

Wydania mniejsze jak i główne zazwyczaj przechodzą przez serię faz wstępnych: **alpha**, **beta**, oraz **release candidate (RC)**. Ich ilość jak i typ zależy od zakresu zmian. Na przykład, wydanie mniejsze z ograniczoną ilością aktualizacji może mieć jedynie fazę beta, a wydanie główne zazwyczaj będzie zawierało wszystkie trzy fazy celem dokładnych testów i zebrania opinii od społeczności.

Możesz zainstalować ostatnie wersje w fazach wstępnych z npm używając `npx install-vue@alpha`, `npx install-vue@beta`, albo `npx install-vue@rc`. Aby przetestować zmiany nieuwzględnione w otagowanych wydaniach, każdym commit do repozytorium [vuejs/core](https://github.com/vuejs/core) jest publikowany jako tymczasowe wydanie poglądowe, które możesz zainstalować używając `npx install-vue@edge`.

Wstępne wydania są przeznaczone do testowania integracji / stabilności oraz dla wczesnych użytkowników, którzy chcą dostarczyć opinii na temat niestabilnych funkcji. Nie używaj wstępnych wydań w produkcji. Wszystkie wstępne wydania są uznawane za niestabilne i mogą zawierać zmiany, które mogą powodować problemy, więc zawsze przypinaj się do dokładnych wersji podczas używania wstępnych wydań.

## Ustępstwa {#deprecations}

Okresowo możemy wycofywać funkcje, które mają nowe, lepsze zamienniki w wydaniach mniejszych. Funkcje oznaczone jako przestarzałe będą nadal działać i zostaną usunięte w następnym głównym wydaniu po ich oznaczeniu jako przestarzałe.

## RFCs {#rfcs}

Nowe funkcje z dużą powierzchnią API oraz istotne zmiany w Vue przechodzą przez proces **Request for Comments** (RFC). Proces RFC ma na celu zapewnienie spójnej i kontrolowanej ścieżki dla wprowadzania nowych funkcji do frameworka oraz umożliwienie użytkownikom udziału i wyrażania opinii w procesie projektowania.

Proces RFC jest prowadzony w repozytorium [vuejs/rfcs](https://github.com/vuejs/rfcs) na GitHubie.

## Funkcje eksperymentalne {#experimental-features}

Niektóre funkcje są dostarczane i dokumentowane w stabilnej wersji Vue, ale oznaczone jako eksperymentalne. Funkcje eksperymentalne to zazwyczaj funkcje, które mają odpowiednią dyskusję RFC z większością problemów projektowych rozwiązanych teoretycznie, ale wciąż brakuje im opinii z rzeczywistego użytkowania.

Celem funkcji eksperymentalnych jest umożliwienie użytkownikom przekazywania opinii na ich temat poprzez testowanie ich w środowisku produkcyjnym, bez konieczności używania niestabilnej wersji Vue. Same funkcje eksperymentalne są uważane za niestabilne i powinny być używane w kontrolowany sposób, z oczekiwaniem, że funkcja może się zmienić pomiędzy różnymi typami wydań.
