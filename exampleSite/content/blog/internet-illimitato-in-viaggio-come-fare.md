---
title: "Internet all'estero: trucchi e consigli per rimanere sempre connessi"
description: Scopri come avere internet sempre attivo all'estero e qualche trucco su come risparmiare GIGA
image: https://res.cloudinary.com/ilgattodicitturin/image/upload/w_1000/f_auto,q_auto:eco/v1689177365/Articoli/Blog/internet-ovunque-illimitato_fkf4ms.png
date: 2023-12-12T13:00:00+01:00
categories: [ "Blog"]
type: featured
sponsored: true
draft: false
---

Essere connessi ad Internet ovunque nel mondo è possibile?
Al giorno d'oggi siamo abituati ad avere facilmente l'accesso a Internet, che ci sembra ancor più essenziale quando si viaggia per rimanere in contatto con amici e familiari, **condividere esperienze sui social**, ottenere informazioni su luoghi da visitare e molto altro. 
Se stai pianificando **un viaggio all'estero** e desideri rimanere connessa/o durante la tua avventura abbiamo preparato una guida pratica su come scegliere la miglior soluzione per avere Internet in viaggio e risparmiare!

#### Quale soluzione usare?
Per avere la connessione Internet all'estero esistono varie soluzioni, alcune gratuite e altre a pagamento. 
La scelta su quale può fare al tuo caso dipende dalla destinazione, dalla durata del viaggio, dalla necessità di GIGA da poter utilizzare, da quanto si vuole spendere. Di seguito trovi un elenco con varie opzioni e soluzioni! Pronti, connessione..via!

> ##### Tabella dei contenuti
> - [Viaggi brevi](#viaggi-brevi)
>   - [Voglio viaggiare in Europa](#voglio-viaggiare-in-europa)
>   - [Voglio andare fuori dall'Europa!](#voglio-andare-fuori-dalleuropa)
> - [Internet illimitato ovunque](#internet-illimitato-ovunque)
>   - [Perché ci ha cambiato la vita in viaggio](#perchè-ci-ha-cambiato-la-vita-in-viaggio)
> - [Ma quindi cosa scegliere?](#ma-quindi-cosa-scegliere)
> - [In breve](#in-breve)
> - [5 trucchi per risparmiare giga](#5-trucchi-per-risparmiare-giga)

##### Viaggi brevi
Di seguito le soluzioni se prevedi di fare un viaggio breve, un weekend o una paio di settimane, sia in Europa che fuori dall'Europa.

###### Voglio viaggiare in Europa
Se prevedi **un viaggio breve** in un paese che fa parte dell'Unione Europa o dell'Area Economica Europea e hai sottoscritto una tariffa mensile con il tuo operatore allora hai diritto ad una quantità di giga dedicati all'estero. 
Inoltre le chiamate e gli sms da e verso numeri italiani saranno in questo caso gratuiti. 

I paesi in cui potrai usufruire dei giga a disposizione sono: Austria, Belgio, Bulgaria, Cipro, Croazia, Danimarca, Estonia, Finlandia, Francia (inclusi Guadalupa, Guyana francese, La Reunion, Mayotte, Martinica), Germania, Gibilterra, Grecia, Irlanda, Islanda, Lettonia, Liechtenstein, Lituania, Lussemburgo, Malta, Norvegia, Olanda, Polonia, Portogallo, Repubblica Ceca, Romania, Slovacchia, Slovenia, Spagna, Svezia, Ungheria. 

Restano esclusi dall’elenco: **Svizzera, Principato di Monaco e il Regno Unito.**

Se vuoi sapere quanti giga hai a disposizione puoi farlo accedendo all'area personale dedicata sul sito del tuo operatore oppure puoi calcolarlo facilmente qua sotto 👇

<div style="color: #222; line-height: 32px; margin-bottom: 15px; position: relative; background-color: #f2f2f2; border-radius: 5px; padding: 30px 105px; margin: 3em 0;">
{{< citazione "Calcola i tuoi giga in roaming in Europa" >}}

Tariffa mensile: <input id="tariffa" type="number" /> € = GB in Roaming: <span id="result"></span> 

<p id="formula"></p>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>

<script>

  $(document).ready(function() {
    let price = 1.80;
    if (Date.parse(Date()) > Date.parse("2024-01-01"))
      price = 1.55;
    else if (Date.parse(Date()) > Date.parse("2025-01-01"))
      price = 1.30;
    else if (Date.parse(Date()) > Date.parse("2026-01-01"))
      price = 1.10;
    else if (Date.parse(Date()) > Date.parse("2027-01-01"))
      price = 1.00;

    document.getElementById('formula').innerText = 'Formula: 2 x costo periodico (senza iva) / ' + price + ' €';  
    document.getElementById('result').innerText = '0';  

    $("input").keyup(function(){
     let result = 2 * $("#tariffa").val() / price;
     document.getElementById('result').innerText = Math.round((result + Number.EPSILON) * 100) / 100 + ' €';
    });

  });

</script>

{{< underline "Attenzione" >}}: il tuo soggiorno non dovrebbe, di norma superare, **i 3 mesi di permanenza**, altrimenti potresti **rischiare che tuo operatore recida il contratto.**

###### Voglio andare fuori dall'Europa!
Spesso gli operatori italiani offrono dei pacchetti ad hoc per i paesi che si vogliono visitare. Questa può essere una soluzione veloce per avere qualche giga da utilizzate all'estero ma spesso non è la scelta più economica. In tal caso ti consigliamo di valutare la prima soluzione che consigliamo per i viaggi lunghi qui di seguito. 

{{< image src="https://res.cloudinary.com/ilgattodicitturin/image/upload/w_1000/f_auto,q_auto:eco/v1684677033/DSC02744_wp34o6.jpg" >}}
_Pure qui, [in Marocco, nel nulla](/blog/5-spot-in-marocco.md), siamo riusciti ad avere connessione!_

##### Viaggi lunghi
Di seguito le soluzioni se prevedi di fare un viaggio lungo in giro per il mondo!

###### Le mitiche SIM locali

Le SIM locali sono la soluzione più economica e facile da sfruttare in giro per il mondo. 
Noi le abbiamo utilizzate in vari paesi sia Europei (Francia, Spagna e Portogallo dato che in questi paesi siamo rimasti a lungo disattivando le promozioni con i nostri operatori che ci garantivano meni giga) che extra Europa (Marocco, Senegal e Montenegro). 
Per farti un esempio in Portogallo la Vodafone {{< extLink "offre dati illimitati" "https://www.vodafone.pt/en/products-services/visiting-portugal.html" >}} a una cifra ragionevole mentre in Francia abbiamo usato {{< extLink "Reglo Mobile" "https://www.reglomobile.fr/" >}}, la più economica che si può acquistare in qualsiasi supermercato E.LeClerc. Se avessimo dovuto usare solo i giga a disposizione con gli operatori italiani non saremmo riusciti a lavorare.

Per le informazioni sulle sim usate in Africa trovi tutto negli articoli dedicati:
  - [Marocco](/blog/marocco-quale-operatore-internet-scegliere)
  - [Senegal](/blog/informazioni-viaggio-senegal#internet)

Il loro limite? Devi acquistarle ogni volta che entri in un nuovo paese, con il rischio di non trovare sempre la soluzione più ottimale, oltre al fatto che potresti non riuscire a sfruttare in toto l'offerta per la quale hai pagato se stai visitando più di un paese di fila.

##### Internet illimitato ovunque!

Ma quindi è possibile avere Internet ILLIMITATO ovunque? **Ebbene sì.**

**Connect PLS** è stata la soluzione migliore che potessimo trovare. 

Come funziona? ConnectPls è un servizio di abbonamento Internet che offre una copertura ad ampio raggio ai viaggiatori **in oltre 130 paesi in tutto il mondo.**

Ovunque davvero? Sì. L'unica limitazione è che a seconda del Paese in si utilizza il dispositivo, potrebbe essere applicato un fair use o un limite di velocità. 
Nei paesi indicati sul loro sito nel gruppo 1, quando l'utilizzo giornaliero dei dati supera i 5 GB si potrebbe riscontrare una diminuzione della velocità di connessione. Nei paesi del Gruppo 2 la connessione sarà a velocità 4G per 500 MB al giorno – 256 kbps una volta raggiunto il limite di velocità. Si tratta principalmente di una protezione contro l'abuso dell'utilizzo dei dati non personali su tutti i dispositivi, ma l'accesso ad Internet sarà in ogni caso illimitato.

{{< image src="https://res.cloudinary.com/ilgattodicitturin/image/upload/w_1000/f_auto,q_auto:eco/v1702369025/Articoli/Blog/internet-illimitato-connectpls_lbtnbm.jpg" >}}
_Il router ha una batteria infinita ed è portatile! Grande Giove!_

###### Perché ci ha cambiato la vita in viaggio
Negli ultimi due mesi, **vivendo come fulltime vanlifers**, ci siamo ritrovati ad attraversare numerose frontiere in Europa e fuori Europa. Se in ogni paese avessimo dovuto cercare informazioni circa le offerte, ricercare dove comprare le sim una volta attraversata la dogana e sfruttare al meglio la promozione calcolando giorni e giga a disposizione avremmo perso tantissimo tempo! 
Con il router di Connect PLS, che viene inviato una volta stipulato l'abbonamento e completo di una sim cloud al suo interno, non abbiamo dovuto pensare più a nulla! **Siamo sempre connessi, oltre ogni confine!**

Scopri di più sul {{< extLink "sito ufficiale" "https://connectpls.com/vandipety" >}} **e ricevi uno sconto del 35% sul primo mese!**

##### Ma quindi cosa scegliere?
La risposta è: **dipende!** 

###### Dove vado?
La prima cosa da capire è dove si vuole andare: in Europa o fuori dall'Europa? E soprattutto: starò solo in un paese specifico o attraverserò più confini? 

###### Quanto dura il mio viaggio?
La seconda cosa da capire è quanto durerà il viaggio: 1 settimana o più di un mese almeno?

###### Quanto "internet" ho bisogno
Questa domanda se la dovrebbe porre chiunque, imparando a conoscere l'effettivo consumo di giga senza che lo schermo del cellulare o del pc ci risucchino in vortici di video o immagini. 
Se stai pianificando un viaggio per vacanza ma non assolutamente rimanere fuori dalla socialità e postare in tempo reale sui social ogni dettaglio della tua fantasmagorica giornata allora sappi che avrai bisogno di parecchi giga, e a meno che tu non rimanga tutto il giorno attaccato al WIFI della hall dell'albergo ti servirà una promozione che non ti abbandoni la prima sera. 

Se sei un nomade digitale o un fulltime vanlifer cerca di capire le tue necessità di download o upload, e ricorda che non sempre i WIFI  dei bar o co-working sono affidabili al 100%.

{{< image src="https://res.cloudinary.com/ilgattodicitturin/image/upload/w_1000/f_auto,q_auto:eco/v1702369025/Articoli/Blog/smartworking-in-van_xctosr.jpg" >}}
_Non conosci i [Sumi me?](/blog/storie-personalizzate-ecco-i-sumi-me)_

##### In breve

<div class="table">
  <table style="white-space: nowrap;">
    <thead>
      <tr>
        <th></th>
        <th>Europa</th>
        <th>Extra Europa</th>
        <th>Più paesi</th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Viaggio breve</td>
        <td>Roaming</td>
        <td>SIM Locale</td>
        <td>SIM Locali</td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>Viaggio Lungo</td>
        <td>SIM Locale</td>
        <td>ConnectionPLS</td>
        <td>ConnectionPLS</td>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>
</div>

#### 5 trucchi per risparmiare giga
Veniamo ora ai trucchi che usiamo viaggiando per risparmiare giga e avere sempre a disposizione le infomazioni utili.

##### 1. Liste Broadcast di Whatsapp
Questo è uno strumento facilissimo di Whatsapp che consente di inviare lo stesso messaggio a più contatti contemporaneamente, senza dover creare un gruppo in cui i partecipanti possano avere accesso ad altri contatti e senza dover scrivere più e più volte il messaggio in ogni chat o inoltrare sempre la stessa fotografia. 
Noi lo usiamo per aggiornare tutti i familiari e risparmiare mega che si trasformano in giga in un batter d'occhio: in questo caso infatti tu invierai un file e poi sarà Whatsapp a destinarlo senza pesare sul tuo consumo. 

{{< image src="https://res.cloudinary.com/ilgattodicitturin/image/upload/w_1000/f_auto,q_auto:eco/v1702369025/Articoli/Blog/whatsapp-liste-broadcast_zzny3z.jpg" >}}
_Un messaggio solo per comunicare con tutti!_

###### Come creare e usare una lista broadcast
Creare una lista broadcast **è facilissimo** ma dipende dal sistema operativo che si utilizza.

Se utilizzi **Android**:
1. Tocca "Altre opzioni" &nbsp; <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 128 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg> > **Nuovo broadcast**.
1. Cerca o seleziona i contatti che vuoi aggiungere.
1. Tocca <i class="fas fa-check"></i>.

Se utilizzi **iOs**:
1. Tocca **Chat** > **Liste broadcast** > **Nuova lista**.
2. Cerca o seleziona i contatti che vuoi aggiungere.
3. Tocca **Crea**.

La lista sarà creata in automatico, solo tu vedrai i partecipanti, che potrai sempre aggiungere o eliminare e le risposte arriveranno a te come chat singole. 

##### 2. Limitare dati
Impostare il limite di consumo dei dati ti aiuterà ad evitare che alcune applicazioni scarichino dati in background a loro piacere ma a tuo sfavore, facendoti consumare più giga del previsto. Come fare?
- {{< extLink "su iOs" "https://support.apple.com/it-it/102433#:~:text=Rete%20cellulare%205G-,Vai%20su%20Impostazioni%20e%20tocca%20Cellulare.,attiva%20Consumo%20limitato%20di%20dati." >}}
- {{< extLink "su Android" "https://support.google.com/duo/answer/6376100?hl=it&co=GENIE.Platform%3DAndroid" >}}

##### 3. Wi-Fi Map
Wi-Fi Map è un'applicazione molto semplice da utilizzare che permette di **individuare tutti i WiFi disponibili nella zona in cui si trova.**

###### Come funziona?
I WiFi sono stati inseriti da altri utenti (e tu stesso puoi aggiungerne uno se lo trovi), che indicano se essi sono ad accesso libero o se richiedono una password e in tal caso quale è la password da inserire. 

{{< image src="https://res.cloudinary.com/ilgattodicitturin/image/upload/w_1000/f_auto,q_auto:eco/v1702369025/Articoli/Blog/wifi-map-applicazione_yekf6y.jpg" >}}
_Un messaggio solo per comunicare con tutti!_

###### Funziona sempre?
Il limite di questa applicazione è che le password dei WiFi nel tempo possono essere modificate senza che nessuno le aggiorni o che il WiFi del bar\ristorante non sia disponibile (es. il locale ha chiuso).

##### 4. Mappe offline
Ci sono molti modi per scaricare le mappe offline sul cellulare.
Noi utilizziamo principalmente:

- maps.me che permette di scaricare le mappe di interi stati, anche se a volte decide di avventurarsi in strade impervie (controlla sempre il percorso, magari escludendo gli sterrati onde evitare di bucare subito una ruota a meno che tu non abbia un mezzo 4x4)
- google maps che permette di scaricare solo piccole porzioni di mappe garantendo però accesso ad informazioni quali supermercati, benzinai, ospedali etc .. nella zona

##### 5. Film, libri e musica offline
Prima di partire noi scarichiamo sempre film o libri o playlist musicali ai quali ci sappiamo che ci farebbe piacere avere accesso nei momenti si svago o durante la guida. 
Vuoi mettere ascoltare solo la radio in lingua locale? E' pur vero che è un ottimo esercizio linguistico!

{{< image src="https://res.cloudinary.com/ilgattodicitturin/image/upload/w_1000/f_auto,q_auto:eco/v1702369025/Articoli/Blog/leggere-ovunque-senza-problemi_lkk6t4.jpg" >}}
_[Scopri cosa leggiamo](/books)_

Non ti resta che partire, ricordandoti di connetterti anche con il luogo che stai per visitare, con le persone del posto, i sapori e tutte le cose belle che potrai portare a casa come bagaglio culturale! 
Speriamo di esserti stati utili, ti aspettiamo nei commenti se avessi dubbi o curiosità. 

{{< youtube hMheQoKeFVY >}}
