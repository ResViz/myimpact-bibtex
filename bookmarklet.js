//javascript:(function(){var s=document.createElement('script');s.src = 'https://arluf.ncl.ac.uk/projects/resviz-scholar/bib_import/bookmarklet.js';document.body.appendChild(s);})();

(function($){
    
    // get some useful details
    var display_name = $('.sg-button > span').text();
    // Note: insert alternative for 'managing' role
    
    // insert BibTeX field
    var $p = $($('#content > p')[0]);
    $p.after('<h5>Auto-fill from BibTeX</h5><div class="warning"><p><strong>Experimental</strong>: BibTeX import functionality is experimental.</p><p>Enter a BibTeX in the text field below (or drop a BibTeX file onto the field) to <em>partially</em> auto-fill the publication fields.</p><textarea style="height:100px;width:75%;" id="bibtex_import"></textarea><input title="Experimental auto-fill fields from BibTeX" id="bibtex_import_btn" value="Auto-fill" type="submit"></div><script src="https://cdn.rawgit.com/ORCID/bibtexParseJs/7bbea66c277b71b6587a6f3ab2e0ce3b936e1bba/bibtexParse.js"></script>');
    
    function parse_bib(e){
        
        e.preventDefault();
        var bib = $('#bibtex_import').val();
        $type = $('#ctl00_ContentList_PublicationFormControl_cboReferenceType');
        
        console.log(bibtexParse.toJSON(bib));
        bib = bibtexParse.toJSON(bib)[0];
        
        // set Reference Type
        if (bib.entryType == 'inproceedings') {
            $type.val('5');
           //aspxETextChanged('ctl00_ContentList_PublicationFormControl_cboReferenceType');
            
            // TODO: Format authors
            $('#AuthorsTextBox_I').val(bib.entryTags.author);
            $('#TitleTextBox_DesignIFrame').contents().find('html').html("<body class=\"dxheDesignViewArea dxheViewArea dxheDesignViewDoc\" contenteditable=\"true\" style=\"border-width: 0px;\">"+bib.entryTags.title+"</body>");
            $('#YearDropDownList').val(bib.entryTags.year);
            $('#JournalTextBox_I').val(bib.entryTags.booktitle);
            $('#ISBNTextBox_I').val(bib.entryTags.isbn);
            $('#Place_PublishedTextBox_I').val(bib.entryTags.location);
            $('#PaginationTextBox_I').val(bib.entryTags.pages);
            $('#URLTextBox').val(bib.entryTags.url);
            $('#DOITextBox').val(bib.entryTags.doi);
            $('#PublisherTextBox_I').val(bib.entryTags.publisher);
            $('#KeywordsTextBox').val(bib.entryTags.keywords);
            $('#BibDropDownList').val('2');
            
        }
        else if (bib.entryType == 'article') {
            $type.val('1');
            aspxETextChanged('ctl00_ContentList_PublicationFormControl_cboReferenceType');
        }
        else {
            alert('Unknown reference type, raise an issue on the repo.');
        }
        
        return false;
    }
    
    // attach listeners
    var $bib = $('#bibtex_import_btn');
    $bib.on('click', parse_bib);
    
})(jQuery);
