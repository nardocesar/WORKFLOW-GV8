const DOMINIO = window.location.protocol + '//' + window.location.host;

String.prototype.toCamelCase = function() {
    return this.replace(/-/g,' ').replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();        
    });
};

var COMPONENTES = (function(){
	function COMPONENTES(){
		this._COMPONENTES = {};
	}

	COMPONENTES.prototype.define = function(elemento,Classe){
		if(document.querySelector(elemento)){
			this._COMPONENTES[elemento.toCamelCase()] = [];

			var elementoList = document.querySelectorAll(elemento);

			for(var i=0 ; i<elementoList.length ; i++){
				this._COMPONENTES[elemento.toCamelCase()].push(new Classe(elementoList[i]));
			}
		}
	}

	COMPONENTES.prototype.log = function() {
		return this;
	};

	return COMPONENTES;
})();

var elementosCustom = new COMPONENTES();
/*
	RESPONSIVE BS CAROUSEL v 2.0
	Agora para ter o seu bootstrap carousel responsivo basta add a classe 'carousel-responsive' e add nos attrs
	'data-md', 'data-sm' e 'data-xs' , a quantidade de itens que vc queira mostrar para tal midia:

	Exemplo:
		Um carousel com  4 itens no desktop, 3 no tablet e 1 no mobile

		<div class="carousel carousel-responsive">
			<div class="carousel-inner">

				<div class="col-md-3 col-sm-4"> ... </div>
				<div class="col-md-3 col-sm-4"> ... </div>
				<div class="col-md-3 col-sm-4"> ... </div>
				<div class="col-md-3 col-sm-4"> ... </div>

			</div>
		</div>
	OBS:
		- Os attrs 'data-md', 'data-sm' e 'data-xs' carregam consigo como valor default 1.
		- É OBRIGATÓRIO a atribuição de um 'id' para o carousel, caso o constrário, o mesmo não funcionará.
*/
$.fn.carouselResponsive = function() {
	return this.each(function(index, el) {
		var alvo = $('#'+$(this).attr('id'));
		var items = alvo.find('.carousel-inner > *');
		var responsive = {
			'xs': $(this).data('xs') || 1,
			'sm': $(this).data('sm') || 1,
			'md': $(this).data('md') || 1
		};
		var midia = 'xs';

		if($(window).width() > 700){
			midia = 'sm';
		}

		if($(window).width() > 991){
			midia = 'md';
		}

		function wrapCarousel(count){
			alvo.find('.carousel-inner .item > *').unwrap('<div class="item"></div>');

			for(i=0;i<items.length;i++){
				alvo.find('.carousel-inner > *').slice(i, i+count).wrapAll('<div class="item"></div>');
			}

			alvo.find('.item:first-child').addClass('active');
		}

		function refreshCarousel (){
			switch(midia){
				case 'xs':
					wrapCarousel(responsive[midia]);
				break;
				case 'sm':
					wrapCarousel(responsive[midia]);
				break;
				case 'md':
					wrapCarousel(responsive[midia]);
				break;
			}
		}

		refreshCarousel ();

		$(window).resize(function(event) {
			refreshCarousel ();
		});
	});
};


$('.carousel-responsive').carouselResponsive();

$('.carousel[data-interval]').each(function(index, el) {
	$(this).carousel({
		interval: $(this).data('interval')
	});
});

$('a[data-carousel="prev"]').click(function(event) {
	event.preventDefault();

	$($(this).attr('href')).carousel('prev');
});

$('a[data-carousel="next"]').click(function(event) {
	event.preventDefault();

	$($(this).attr('href')).carousel('next');
});

$('.carousel').on('swipeleft',function(){
	$(this).carousel('next');
});

$('.carousel').on('swiperight',function(){
	$(this).carousel('prev');
});
function hasWebP() {
    var rv = $.Deferred(), img = new Image();
    img.onload = function() { rv.resolve(); };
    img.onerror = function() { rv.reject(); };
    img.src = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAgA0JaQAA3AA/vv9UAA=";
    return rv.promise();
}

hasWebP().then(function() {
    console.log("Hooray!!  WebP is enabled.  Things will be wonderful now.");

    $('[data-webp-bg-fallback]').each(function(index,el){
    	$(this).removeAttr('data-lazy-bg');
    });

}, function() {
    console.log("Note: your browser does not support the new Google WebP format. Please remain where you are while our support team locates you to begin the reeducation process.");
    
    $('[data-webp-bg-fallback]').each(function(index, el) {
    	$(this).css('background-image', 'url('+$(this).data('webp-bg-fallback')+')');
    	$(this).attr('data-lazy-bg',$(this).data('webp-bg-fallback'));
    });
});
var LazyBg = (function(){
	'use restrict';
	var isLazedBg = function(){
		$('[data-lazy-bg]').each(function(index, el) {
			if(el.getBoundingClientRect().top < window.innerHeight + 200){
				$(this).css('background-image', 'url('+$(this).attr('data-lazy-bg')+')');
				$(this).removeAttr('data-lazy-bg')
			}
		});
	};
	var jaLazyimageBg = false;

	setTimeout(isLazedBg(),200);

	$(window).scroll(function(event) {
		if(jaLazyimageBg) return;

		setTimeout(function(){
			jaLazyimageBg = false;
		},100);

		isLazedBg();
	});
})();
$.fn.isLazyIframe = function(){
	return this.each(function(){
		if(this.getBoundingClientRect().top < window.innerHeight + 200){
			if(!this.getAttribute('loaded')){
				var template = $(this).find('template');
				var video = template.html();

				if(template){
					$(this).append(video);
					template.remove();
					$(this).attr('loaded', 'true');
				}
			}
		}
	});
};

$.fn.lazyIframe = function(){
	var jaLazyIframe = false;

	return this.each(function(){
		var frame = this;

		$(frame).isLazyIframe();

		$(window).scroll(function(){
			if (jaLazyIframe) return;

			setTimeout(function(){
				jaLazyIframe = false;
			},100);

			$(frame).isLazyIframe();
		});
	});
};

$('lazyiframe').lazyIframe();
$.fn.isLazyImage = function(){
	return this.each(function(){
		if(this.getBoundingClientRect().top < window.innerHeight + 200){
			if(!this.getAttribute('loaded')){
				var src = this.getAttribute('src') || this.getAttribute('data-src');
				var alt = this.getAttribute('alt') || this.getAttribute('data-alt');

				var img = document.createElement('img');

				if(this.getAttribute('data-classe')){
					var classe = this.getAttribute('data-classe') + ' img-responsive';
				}else{
					var classe = 'img-responsive';
				}

				img.setAttribute('src',src);
				img.setAttribute('alt',alt);
				img.setAttribute('class',classe);


				this.appendChild(img);
				this.setAttribute('loaded','true');
			}
		}
	});
};

$.fn.lazyImage = function(){
	var jaLazyImage = false;
	return this.each(function(){
		var lazy = this;

		$(lazy).isLazyImage();

		$(window).scroll(function(){
			if(jaLazyImage) return;

			setTimeout(function(){
				jaLazyImage = false;
			},100);

			$(lazy).isLazyImage();
		});
	});
};

$('lazyimage').lazyImage();
/*jQuery.getJSON('../json/videos-youtube.json', function(data, textStatus) {
	youtubeSuccess(data)
});*/

$('[data-load-video]').click(function(){
	var alvo = $(this).data('target');
	console.log(alvo)
});

function youtubeSuccess(data){
	var content ='';

	for(video in data.videos){
		var idVideo = data.videos[video].src.replace('https://www.youtube.com/watch?v=','');
		var urlVideo = data.videos[video].src;
		var fx = "changeVideo('"+urlVideo+"')";

		var item = '<div class="thumb" onclick="'+fx+'">'+
			'<img src="https://img.youtube.com/vi/'+idVideo+'/hqdefault.jpg" alt="" class="img-responsive" />'+
		'</div>';

		content += item;

	}

	function escrever (){
		var qntTotalDeItens = data.videos.length;

		if ($(window).width() < 991){
			$('#carousel-1 .carousel-inner').html(content);
		}

		if($(window).width() >= 991){
			$('#carousel-2 .carousel-inner').html(content);
		}

		verifyMidia(qntTotalDeItens);

		$('.youtube-carousel .item:first-child').addClass('active');

		$('.youtube-carousel').carousel({interval: 0});
	}

	function verifyMidia(qnt){
		var w = $(window).width();

		var midia = 'xs';

		if (w > 700){
			midia = 'sm';
		}

		if(w > 991){
			midia = 'md'
		}

		switch (midia){
			case 'md':
				sliceProdutos(qnt,4);
			break;

			case 'sm':
				sliceProdutos(qnt,3);
			break;

			case 'xs' :
				sliceProdutos(qnt,1);
			break;

			default :
				sliceProdutos(qnt,1);
			break;

		}
	}

	function sliceProdutos(qnt,cont){
		for( var i = 0 ; i < qnt; i += cont){
			$('.youtube-carousel .thumb').slice(i,i+cont).wrapAll('<div class="item"></div>');
		}
	}

	escrever();

	$(window).resize(function(){
		escrever();
	});
}


function changeVideo(url){
	var idVideo = url.replace('https://www.youtube.com/watch?v=','');
	var iframe = '<iframe src="https://www.youtube.com/embed/'+idVideo+'" frameborder="0" allowfullscreen=""></iframe>';
	$('#video-g').html(iframe);
}
function remover($target){
	$($target).fadeOut('fast',function(){
		$($target).remove();
	})
}

$('.pergunta').click(function(){
	$(this).toggleClass('text-success');
})
$('.sidebar span[data-toggle="collapse"]').click(function(){
	var fa = $(this).find('.fa');
	var status = fa.attr('class').replace('fa ','');

	if(status == 'fa-minus'){
		fa.removeClass('fa-minus').addClass('fa-plus')
	}else{
		fa.removeClass('fa-plus').addClass('fa-minus')
	}

	// console.log(status)
});

$('.sidebar .aux').click(function(){
	$('.sidebar').removeClass('open');
});

$('.btn-toggle-sidebar').click(function(){
	$('.sidebar').addClass('open');
});

$('html').on('swipeleft',function(){
	$('.sidebar').removeClass('open');
});

$('html').on('swiperight',function(){
	$('.sidebar').addClass('open');
});

//# sourceMappingURL=scripts.js.map
