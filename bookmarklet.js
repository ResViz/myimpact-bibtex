//javascript:(function(){var s=document.createElement('script');s.src = 'https://resviz.github.io/myimpact-bibtex/bookmarklet.js';document.body.appendChild(s);})();

(function($){
    
    if (window.myimpact_bibtex_run_once) return;
    window.myimpact_bibtex_run_once = true;
    
    // get some useful details
    var display_name = $('.sg-button > span').text();
    // Note: insert alternative for 'managing' role
    
    // insert BibTeX field
    var $p = $($('#content > p')[0]);
    $p.after('<h5>Auto-fill from BibTeX</h5><div class="warning"><p><strong>Experimental</strong>: BibTeX import functionality is experimental.</p><p>Choose the correct <em>Reference Type</em> and then enter a BibTeX or drop a BibTeX file in the text field below to <em>partially</em> auto-fill the publication fields.</p><p><textarea style="height:100px;width:75%;" id="bibtex_import" title="Paste BibTeX text here"></textarea></p><p><input title="Experimental auto-fill fields from BibTeX" id="bibtex_import_btn" value="Auto-fill" type="submit"></p></div><script src="https://cdn.rawgit.com/ORCID/bibtexParseJs/7bbea66c277b71b6587a6f3ab2e0ce3b936e1bba/bibtexParse.js"></script>');
    // Alternative parser: https://cdn.rawgit.com/mayanklahiri/bib2json/5834c5d35dc1a7ccf73ee99745eed43ec62e0c1a/Parser.js
    
    function parse_bib(e){
        
        e.preventDefault();
        
        var bib = $('#bibtex_import').val();
        
        if (!bib) {
            alert('There was an error parsing this provided BibTeX file, please raise an issue on the GitHub repo (https://github.com/ResViz/myimpact-bibtex/issues).');
        }
        
        // Springer has invalid BibTeX entries!
        // http://sourceforge.net/p/bibdesk/feature-requests/812/
        if (bib.match(/^@[^{]+\{([^,]+)/)[1].match('=')) {
            // found a property before first comma, insert a fake 'KEY'
            bib = bib.replace(/^(@[^{]+\{)([^,]+)/,'$1KEY,$2');
        }
        
        //console.log(bib);
        //var entries = BibtexParser(bib);
        //console.log(entries);
        bib = bibtexParse.toJSON(bib)[0];
        //console.log(bib);
        
        // removed: detect and set Reference Type
        /*$type = $('#ctl00_ContentList_PublicationFormControl_cboReferenceType');
        if (bib.entryType == 'inproceedings') {
            $type.val('5');
            aspxETextChanged('ctl00_ContentList_PublicationFormControl_cboReferenceType');
        }*/
        
        // TODO: Format authors
        // Possible bug: Assuming author format "Last, First I. and Last, First I."
        var authors = bib.entryTags.author.split(' and ');
        var new_authors = [];
        for (var i=0; i<authors.length; i++) {
            // split author names by space
            var lastfirst = authors[i].split(/, */,2);
            new_authors[i] = lastfirst[0] + ', '; // 'LASTNAME, '
            var firsts = lastfirst[1].split(/[\. ]+/);
            for (var j=0; j<firsts.length; j++) {
                // keep only first letter of name parts > 0
                if (firsts[j][0]) {
                    new_authors[i] = new_authors[i] + firsts[j][0];
                }
            }
        }
        authors = new_authors.join('; ');
        
        // Auto-fill form fields
        function autofill(id, value) {
            if (value) {
                if (id.substr(-6) == 'IFrame') {
                    $('#'+id).contents().find('html').html('<body class="dxheDesignViewArea dxheViewArea dxheDesignViewDoc" contenteditable="true" style="border-width: 0px;">'+value+'</body>');
                } else {
                    $('#'+id).val(value);
                }
            }
        }
        
        autofill('AuthorsTextBox_I',authors);
        autofill('TitleTextBox_DesignIFrame',bib.entryTags.title);
        autofill('YearDropDownList',bib.entryTags.year);
        autofill('JournalTextBox_I',bib.entryTags.journal || bib.entryTags.booktitle);
        autofill('ISBNTextBox_I',bib.entryTags.isbn);
        autofill('Place_PublishedTextBox_I',bib.entryTags.location);
        autofill('PaginationTextBox_I',bib.entryTags.pages);
        autofill('URLTextBox',bib.entryTags.url);
        autofill('DOITextBox',bib.entryTags.doi);
        autofill('PublisherTextBox_I',bib.entryTags.publisher);
        autofill('KeywordsTextBox',bib.entryTags.keywords);
        autofill('BibDropDownList','2');
        autofill('VolumeTextBox_I',bib.entryTags.volume);
        autofill('AbstractTextBox_DesignIFrame',bib.entryTags.abstract);
        
        return false;
    }
    
    // attach listeners
    var $bib = $('#bibtex_import_btn');
    $bib.on('click', parse_bib);
    
})(jQuery);
