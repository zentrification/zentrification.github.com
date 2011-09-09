(function() {
  var sortByName, watcher;
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };
  jQuery.fn.sort = function() {
    return this.pushStack([].sort.apply(this, arguements), []);
  };
  sortByName = function(a, b) {
    if (a.name.toUpperCase() === b.name.toUpperCase()) {
      return 0;
    } else if (a.name.toUpperCase() > b.name.toUpperCase()) {
      return 1;
    } else {
      return -1;
    }
  };
  watcher = {
    loadUser: function(username) {
      var github_url;
      $('h1 a').text(' ' + username.capitalize());
      $('h1 a').attr('href', 'http://github.com/' + username);
      $('#repositories tbody').hide();
      $('#ajax-loader').show();
      $('#menu span').text('All');
      $('#languages').empty('li');
      $('#repositories tbody').empty('tr');
      github_url = 'http://github.com/api/v2/json/repos/watched/' + username + '?callback=?';
      return $.getJSON(github_url, function(json, status) {
        var langs, sorted_repos;
        sorted_repos = json.repositories.sort(sortByName);
        console.log('hi');
        $('#repoTemplate').tmpl(sorted_repos).appendTo('#repositories tbody');
        console.log('hi2');
        $('#repositories tbody tr:last').removeClass('bordered');
        langs = $.unique($.unique($('.repository').map(function() {
          if ($(this).attr('rel')) {
            return $(this).attr('rel');
          }
        }).get()));
        langs = $.map(langs, function(n, i) {
          return {
            name: n
          };
        });
        langs.push({
          name: 'All'
        });
        $('#languageTemplate').tmpl(langs.sort(sortByName)).appendTo('#languages');
        $('#repositories').trigger('update');
        $('#ajax-loader').hide();
        return $('#repositories tbody').fadeIn('slow');
      });
    },
    filterLanguage: function() {
      return $('.language-name').live('click', function(event) {
        var languageName;
        languageName = $(this).children('a').text();
        $('#menu span').text(languageName);
        $('#repositories tbody tr:last').removeClass('bordered');
        event.preventDefault();
        if (languageName === 'All') {
          return $('.repository').fadeIn('slow');
        } else {
          $('.repository').hide();
          return $('.repository[rel=' + languageName + ']').fadeIn('slow');
        }
      });
    },
    switchUser: function() {
      return $('.owner').live('click', function(event) {
        watcher.loadUser($(this).text().trim());
        return event.preventDefault();
      });
    }
  };
  jQuery(document).bind('ready', function() {
    watcher.loadUser('zentrification');
    watcher.filterLanguage();
    watcher.switchUser();
    return $('#repositories').tablesorter();
  });
}).call(this);
