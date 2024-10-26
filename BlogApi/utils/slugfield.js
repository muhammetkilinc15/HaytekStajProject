import slugify from 'slugify';

const slugField = function (str,id) {
    return slugify(str, {
        replacement: '-',  // boşlukları tire ile değiştir
        remove: undefined, // regex ile eşleşen karakterleri kaldırma
        lower: true,       // küçük harfe çevir
        strict: true,      // özel karakterleri temizle
        locale: 'tr',      // Türkçe locale kullan
        trim: true ,        // baştaki ve sondaki boşlukları temizle
    });
};

export default slugField;
