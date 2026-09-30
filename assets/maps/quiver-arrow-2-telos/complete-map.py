import json, copy
from pathlib import Path
from lxml import etree as E
root=Path('assets/maps/quiver-arrow-2-telos')
s=''
for l in (root/'granada-costa.events.txt').read_text().splitlines():
 if l.startswith('data:'):
  try:d=json.loads(l[5:])
  except:continue
  if isinstance(d,dict) and 'svg' in d:s=s+d['svg'] if d.get('update_type')=='delta' else d['svg']
(root/'granada-costa.quiver-partial.txt').write_text(s)
# Keep only fully received SVG elements; close open groups using XML recovery.
s=s[:s.rfind('<path')]
a=E.fromstring(s.encode(),parser=E.XMLParser(recover=True))
(root/'granada-costa.original.svg').write_bytes(E.tostring(a,pretty_print=True))
ns='http://www.w3.org/2000/svg'
svg=E.Element('{%s}svg'%ns,nsmap={None:ns},width='1400',height='950',viewBox='0 0 1400 950')
def sub(p,tag,**attrs):return E.SubElement(p,'{%s}%s'%(ns,tag),{k.replace('_','-'):str(v) for k,v in attrs.items()})
sub(svg,'title').text='Granada al Mediterráneo — mapa ilustrado'
sub(svg,'desc').text='Relieve vectorial generado por Quiver Arrow 2 Telos; costa y rotulación completadas localmente. Mapa editorial orientativo.'
sub(svg,'rect',id='background',width=1400,height=950,fill='#1a1917')
for e in a:
 if E.QName(e).localname=='defs':svg.append(copy.deepcopy(e))
terrain=sub(svg,'g',id='relief',transform='scale(1.3671875 .96)',opacity='.68')
for e in a:
 if E.QName(e).localname=='g':terrain.append(copy.deepcopy(e))
# Native SVG coastline and typographic finish, separate from generated terrain.
coast='M0 803 C55 797 92 792 133 785 S204 779 240 782 S293 788 320 781 S359 778 380 786 S408 801 430 797 S456 782 474 786 S497 804 519 810 S552 811 573 803 S610 795 638 801 S666 809 698 807 S736 792 765 788 S801 779 832 783 S867 791 903 786 S954 772 990 771 S1044 779 1079 773 S1141 763 1180 764 S1246 776 1294 770 S1360 763 1400 765'
sub(svg,'path',id='sea',d=coast+' L1400 950 L0 950Z',fill='#20201d')
sea=sub(svg,'g',id='bathymetry',fill='none',stroke='#b9ad99',stroke_width='.7',opacity='.13')
for y in [14,29,46,66,90]:sub(sea,'path',d=coast,transform=f'translate(0 {y})')
sub(svg,'path',id='coastline',d=coast,fill='none',stroke='#f8f6f1',stroke_width='1.6',opacity='.78')
labels=sub(svg,'g',id='labels')
def text(x,y,t,size=16,color='#f8f6f1',family='Arial, sans-serif',spacing=None,anchor='middle'):
 attrs=dict(x=x,y=y,fill=color,font_family=family,font_size=size,text_anchor=anchor,stroke='#1a1917',stroke_width=5,stroke_linejoin='round',paint_order='stroke fill')
 if spacing:attrs['letter_spacing']=spacing
 el=sub(labels,'text',**attrs);el.text=t
 return el
text(965,300,'Sierra Nevada',29,'#b9ad99','Georgia, serif')
text(304,493,'Sierra de Almijara',23,'#b9ad99','Georgia, serif')
text(1020,617,'Sierra de Lújar',23,'#b9ad99','Georgia, serif')
text(182,140,'Sierra de Loja',19,'#b9ad99','Georgia, serif')
text(469,261,'VEGA DE GRANADA',11,'#b9ad99',spacing=3)
text(608,503,'VALLE DE LECRÍN',11,'#b9ad99',spacing=2.7)
text(1040,524,'LA ALPUJARRA',11,'#b9ad99',spacing=3)
text(768,748,'COSTA TROPICAL',11,'#b9ad99',spacing=3)
text(790,889,'Mar Mediterráneo',31,'#b9ad99','Georgia, serif',spacing=2)
points=sub(svg,'g',id='towns')
for name,x,y,tx,ty in [('Granada',595,224,615,215),('Loja',169,211,187,218),('Nigüelas',655,428,675,434),('Capileira',913,450,934,455),('La Herradura',532,800,451,837),('Motril',835,760,854,766)]:
 sub(points,'circle',cx=x,cy=y,r=5 if name!='Granada' else 6,fill='#e27a4a' if name!='Granada' else '#f8f6f1',stroke='#1a1917',stroke_width=3)
 if name=='Granada':sub(points,'circle',cx=x,cy=y,r=11,fill='none',stroke='#e27a4a',stroke_width='1')
 text(tx,ty,name,19 if name=='Granada' else 17,anchor='start')
 if name=='La Herradura':sub(points,'path',d='M532 807L525 820H503',fill='none',stroke='#b9ad99',stroke_width='.8')
sub(svg,'path',d='M1032 360l6 -11 6 11z',fill='none',stroke='#b9ad99',stroke_width=1)
text(1054,361,'MULHACÉN',10,'#b9ad99',spacing=1.8,anchor='start')
sub(svg,'path',d='M1292 100V56m-6 11 6-13 6 13',fill='none',stroke='#b9ad99',stroke_width=1)
text(1292,43,'N',11,'#b9ad99')
(root/'granada-costa.svg').write_bytes(E.tostring(svg,pretty_print=True,xml_declaration=True,encoding='utf-8'))
print('Completed map:',len(list(svg.iter())),'SVG elements')
