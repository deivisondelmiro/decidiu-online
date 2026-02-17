import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { FeatureCollection, Feature, Geometry } from 'geojson';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MunicipioData {
  nome: string;
  profissionais_capacitados: number;
  insercoes: number;
}

interface MapaAlagoasLeafletProps {
  dados: MunicipioData[];
  municipioSelecionado: string | null;
  onMunicipioClick: (municipio: string | null) => void;
}

export default function MapaAlagoasLeaflet({ dados, municipioSelecionado, onMunicipioClick }: MapaAlagoasLeafletProps) {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/alagoas-municipios.json')
      .then(res => res.json())
      .then(data => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar GeoJSON:', error);
        setLoading(false);
      });
  }, []);

  const getDadosMunicipio = (nomeMunicipio: string): MunicipioData | undefined => {
    return dados.find(d =>
      d.nome.toLowerCase() === nomeMunicipio.toLowerCase()
    );
  };

  const getColorByIntensity = (capacitados: number): string => {
    if (capacitados === 0) return '#e2e8f0';
    if (capacitados <= 5) return '#bbf7d0';
    if (capacitados <= 10) return '#4ade80';
    if (capacitados <= 20) return '#16a34a';
    return '#14532d';
  };

  const style = (feature?: Feature<Geometry, any>) => {
    if (!feature) return {};

    const nomeMunicipio = feature.properties?.name || '';
    const dadosMunicipio = getDadosMunicipio(nomeMunicipio);
    const capacitados = dadosMunicipio?.profissionais_capacitados || 0;
    const isSelected = municipioSelecionado === nomeMunicipio.toLowerCase().replace(/\s+/g, '-');

    return {
      fillColor: getColorByIntensity(capacitados),
      weight: isSelected ? 3 : 1,
      opacity: 1,
      color: isSelected ? '#1a4d2e' : '#ffffff',
      fillOpacity: 0.7
    };
  };

  const onEachFeature = (feature: Feature<Geometry, any>, layer: L.Layer) => {
    const nomeMunicipio = feature.properties?.name || '';
    const dadosMunicipio = getDadosMunicipio(nomeMunicipio);

    if (layer instanceof L.Path) {
      layer.on({
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            weight: 3,
            fillOpacity: 0.9
          });
          layer.bringToFront();

          const tooltipContent = `
            <div style="padding: 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${nomeMunicipio}</div>
              <div style="font-size: 12px;">
                <div>Profissionais capacitados: <strong>${dadosMunicipio?.profissionais_capacitados || 0}</strong></div>
                <div>Inserções realizadas: <strong>${dadosMunicipio?.insercoes || 0}</strong></div>
              </div>
            </div>
          `;
          layer.bindTooltip(tooltipContent, { sticky: true }).openTooltip();
        },
        mouseout: (e) => {
          const layer = e.target;
          const isSelected = municipioSelecionado === nomeMunicipio.toLowerCase().replace(/\s+/g, '-');
          layer.setStyle({
            weight: isSelected ? 3 : 1,
            fillOpacity: 0.7
          });
          layer.closeTooltip();
        },
        click: () => {
          const municipioId = nomeMunicipio.toLowerCase().replace(/\s+/g, '-');
          if (municipioSelecionado === municipioId) {
            onMunicipioClick(null);
          } else {
            onMunicipioClick(municipioId);
          }
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  if (!geoData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-96">
          <p className="text-red-600">Erro ao carregar mapa</p>
        </div>
      </div>
    );
  }

  const municipioSelecionadoNome = municipioSelecionado
    ? dados.find(d => d.nome.toLowerCase().replace(/\s+/g, '-') === municipioSelecionado)?.nome
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Mapa de Alagoas: Profissionais Capacitados por Município
        </h2>
        <p className="text-sm text-gray-600">
          O mapa mostra a distribuição de profissionais capacitados por município através de variações de cores.
          {municipioSelecionadoNome && (
            <span className="ml-2 font-medium text-[#1a4d2e]">
              Exibindo dados de: {municipioSelecionadoNome}
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1" style={{ height: '600px', width: '100%' }}>
          <MapContainer
            center={[-9.5713, -36.7820]}
            zoom={7}
            minZoom={7}
            maxZoom={11}
            maxBounds={[[-10.5, -38.2], [-8.5, -35.0]]}
            maxBoundsViscosity={1.0}
            style={{ height: '100%', width: '100%', borderRadius: '8px' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON
              data={geoData}
              style={style}
              onEachFeature={onEachFeature}
            />
          </MapContainer>
        </div>

        <div className="lg:w-64">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quantidade de profissionais capacitados</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 rounded" style={{ backgroundColor: '#e2e8f0' }}></div>
                <span className="text-xs text-gray-600">Sem profissionais</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 rounded" style={{ backgroundColor: '#bbf7d0' }}></div>
                <span className="text-xs text-gray-600">1-5</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 rounded" style={{ backgroundColor: '#4ade80' }}></div>
                <span className="text-xs text-gray-600">6-10</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 rounded" style={{ backgroundColor: '#16a34a' }}></div>
                <span className="text-xs text-gray-600">11-20</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-4 rounded" style={{ backgroundColor: '#14532d' }}></div>
                <span className="text-xs text-gray-600">+20</span>
              </div>
            </div>

            {municipioSelecionado && (
              <button
                onClick={() => onMunicipioClick(null)}
                className="mt-4 w-full px-3 py-2 bg-[#1a4d2e] text-white text-sm rounded-lg hover:bg-[#143d24] transition-colors"
              >
                Ver todos os municípios
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
