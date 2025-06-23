// Değişkenler
let soruAlani = document.querySelector("#soruAlani");
let soruUret = document.querySelector("#soruUret");
let soruKopyala = document.querySelector("#soruKopyala");
let basarili = document.querySelector("#basarili");
let soruAdeti = document.querySelector("#soruAdeti");
let oncekiSoru = document.querySelector("#oncekiSoru");
let genelAlan = document.querySelector("#genelAlan");
let sorularBitti = document.querySelector("#sorularBitti");
let video = document.querySelector("#video");
let gecilenSoruAdeti = document.querySelector("#gecilenSoruAdeti");
let header = document.getElementById("header");
let banner = document.getElementById("banner");
let bannerButton = document.getElementById("banner-button");
let whatsAppGonder = document.getElementById("whatsAppGonder");
let contributors = document.getElementById("contributors");
let kategoriSec = document.getElementById("kategoriSec");

// Soruları tutacağımız dizi & soru indexlerini tutacağımız dizi
const sorular = [];
const soruIndexler = [];
let filtreliSorular = [];
let aktifKategori = "";

// Kategorileri select'e ekle
function kategorileriDoldur() {
  // Tüm kategorileri tek bir diziye topla ve benzersiz hale getir
  const kategoriler = [...new Set(sorular.flatMap(s => Array.isArray(s.kategori) ? s.kategori : [s.kategori]))];
  kategoriSec.innerHTML = '<option value="">Tümü</option>' +
    kategoriler.map(k => `<option value="${k}">${k}</option>`).join("");
}

// Kategoriye göre filtrele
function kategoriyeGoreFiltrele(kategori) {
  if (!kategori) {
    filtreliSorular = [...sorular];
  } else {
    filtreliSorular = sorular.filter(s => Array.isArray(s.kategori) ? s.kategori.includes(kategori) : s.kategori === kategori);
  }
  // Sıfırla
  soruIndexler.length = 0;
}

// Soru sayısı üretir
function soruSayisiUret() {
  let index;
  if (filtreliSorular.length === soruIndexler.length) {
    // Sorular bittiğinde boşalt
    genelAlan.style.display = "none";
    sorularBitti.style.display = "";
    setInterval(function () {
      location.reload();
    }, 5000);
  } else {
    do {
      index = Math.floor(Math.random() * filtreliSorular.length);
    } while (soruIndexler.includes(index)); // daha önce üretilmişse tekrar dene
    soruIndexler.push(index);
    return index;
  }
}

// Önceki soru kontrolü
function oncekiSoruKontrol() {
  return soruIndexler.length === 0;
}

// Önceki soru butonunu kontrol eder
function oncekiButtonKontrol() {
  if (oncekiSoruKontrol()) {
    oncekiSoru.style.display = "none";
  } else {
    oncekiSoru.style.display = "block";
  }
}

// XMLHttpRequest (XHR) kullanarak qWc.json dosyasını okuyoruz
const xhr = new XMLHttpRequest();
xhr.open("GET", "../json/qWc.json", true);
xhr.responseType = "json";

xhr.onload = function () {
  // JSON verilerini bir objeye atıyoruz
  const sorularObj = xhr.response;

  // sorular dizisini doğrudan dizi olarak ekliyoruz
  sorular.push(...sorularObj);
  kategoriyeGoreFiltrele("");
  kategorileriDoldur();
  const ilkSayi = soruSayisiUret();
  soruAlani.innerHTML = filtreliSorular[ilkSayi].soru;
  soruAdeti.innerHTML = `<p>Güncel soru sayısı : <span class="soruSayisi"> ${filtreliSorular.length}</span>
  <br>
  Gösterilen soru sayısı : <span class="soruSayisi"> ${soruIndexler.length}</span></p>`;
};

xhr.send();

// düğmelere tıklandığında oncekiSoru kontrolü yapar
document.addEventListener("click", function (e) {
  oncekiButtonKontrol();
});

// kategori seçildiğinde soruları filtrele
kategoriSec.addEventListener("change", function () {
  aktifKategori = kategoriSec.value;
  kategoriyeGoreFiltrele(aktifKategori);
  if (filtreliSorular.length > 0) {
    const sayi = soruSayisiUret();
    soruAlani.innerHTML = filtreliSorular[sayi].soru;
    soruAdeti.innerHTML = `<p>Güncel soru sayısı : <span class="soruSayisi"> ${filtreliSorular.length}</span>
    <br>
    Gösterilen soru sayısı : <span class="soruSayisi"> ${soruIndexler.length}</span></p>`;
  } else {
    soruAlani.innerHTML = "Bu kategoride soru yok.";
    soruAdeti.innerHTML = "";
  }
});

// soruUret düğmesine tıklanıldığında rastgele bir soru gösterir
soruUret.addEventListener("click", function () {
  sayi = soruSayisiUret();
  soruAlani.innerHTML = filtreliSorular[sayi].soru;
  soruAdeti.innerHTML = `<p>Güncel soru sayısı : <span class="soruSayisi"> ${filtreliSorular.length}</span>
  <br>
  Gösterilen soru sayısı : <span class="soruSayisi"> ${soruIndexler.length}</span></p>`;
});

// soruKopyala düğmesine tıklanıldığında soruAlani içindeki metni panoya kopyalar
soruKopyala.addEventListener("click", function () {
  navigator.clipboard.writeText(soruAlani.innerHTML);
  // Toastify ile kopyalandı yazısı gösterir
  Toastify({
    text: "Kopyalandı 😉",
    style: {
      backgroundColor: "#B83051",
      color: "#fff",
      padding: "12px 16px",
      borderRadius: "10px",
      opacity: 0.95,
      transition: "opacity 0.3s ease-in-out",
      position: "fixed",
      top: "0",
      right: "0",
      marginRight: "10px",
      paddingRight: "20px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
      zIndex: 9999,
    },
  }).showToast();
});

// oncekiSoru düğmesine tıklanıldığında önceki soruyu gösterir
oncekiSoru.addEventListener("click", function () {
  soruIndexler.pop();
  if (oncekiSoruKontrol()) {
    soruAlani.innerHTML = "İyi anarya yaptın he :)";
  } else {
    soruAlani.innerHTML = filtreliSorular[soruIndexler[soruIndexler.length - 1]].soru;
  }
});

// banner açıp kapatma
bannerButton.addEventListener("click", function () {
  banner.style.display = "none";
  header.style.paddingTop = "3rem";
});

// Whatsapp paylaşma
whatsAppGonder.addEventListener("click", function () {
  let whatsappLink = `https://api.whatsapp.com/send?text=${soruAlani.innerHTML}`;
  window.open(whatsappLink, "_blank");
});

// Katkıda bulunanlar çekme
fetch("https://api.github.com/repos/alicangunduz/tanismada-sohbet-tikanmasin/contributors")
  .then((response) => response.json())
  .then(async (data) => {
    for (const contributor of data) {
      const contributorName = contributor.login;
      const contributorAvatar = contributor.avatar_url;
      const commitsResponse = await fetch(`https://api.github.com/repos/alicangunduz/tanismada-sohbet-tikanmasin/commits?author=${contributorName}`);
      const commitsData = await commitsResponse.json();
      const contributorCommits = commitsData.length;
      const isOwner = contributorName === "alicangunduz" ? '<span class="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">Owner</span>' : '';
      contributors.innerHTML += `
        <div class="flex items-center space-x-4">
          <a href="https://github.com/alicangunduz/tanismada-sohbet-tikanmasin/commits?author=${contributorName}">
            <img class="w-10 h-10 rounded-full" src="${contributorAvatar}" alt="${contributorName}">
          </a>
          <div class="font-medium dark:text-dark">
            <a href="https://github.com/alicangunduz/tanismada-sohbet-tikanmasin/commits?author=${contributorName}">
              <div>${contributorName} ${isOwner}</div>
            </a>
            <a href="https://github.com/alicangunduz/tanismada-sohbet-tikanmasin/commits?author=${contributorName}">
              <div class="text-sm text-gray-500 dark:text-gray-400">${contributorCommits} commits</div>
            </a>
          </div>
        </div>
      `;
    }
  })
  .catch((error) => console.error(error));