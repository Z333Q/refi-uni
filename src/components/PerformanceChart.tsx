import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';

interface PerformanceChartProps {
  data?: Array<{ time: string; value: number }>;
  height?: number;
}

export function PerformanceChart({ data, height = 300 }: PerformanceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const [timeframe, setTimeframe] = useState('1D');
  const animationFrameRef = useRef<number | null>(null);

  // Generate mock data based on timeframe
  const generateMockData = (period: string) => {
    const now = new Date();
    const dataPoints: Array<{ time: string; value: number }> = [];
    let intervals: number;
    let intervalMs: number;
    let baseValue = 45230;

    switch (period) {
      case '1H':
        intervals = 60;
        intervalMs = 60 * 1000; // 1 minute
        break;
      case '1D':
        intervals = 24;
        intervalMs = 60 * 60 * 1000; // 1 hour
        break;
      case '1W':
        intervals = 7;
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        break;
      case '1M':
        intervals = 30;
        intervalMs = 24 * 60 * 60 * 1000; // 1 day
        break;
      default:
        intervals = 24;
        intervalMs = 60 * 60 * 1000;
    }

    for (let i = intervals; i >= 0; i--) {
      const time = new Date(now.getTime() - i * intervalMs);
      // Add some realistic price movement
      const volatility = 0.02;
      const trend = 0.001;
      const randomChange = (Math.random() - 0.5) * volatility;
      baseValue = baseValue * (1 + trend + randomChange);
      
      dataPoints.push({
        time: time.toISOString().split('T')[0],
        value: Math.round(baseValue * 100) / 100
      });
    }

    return dataPoints;
  };

  // Initialize chart once when component mounts
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const initializeChart = () => {
      // Check if container has valid dimensions
      if (!chartContainerRef.current || 
          chartContainerRef.current.clientWidth <= 0 || 
          chartContainerRef.current.clientHeight <= 0) {
        // Retry on next animation frame
        animationFrameRef.current = requestAnimationFrame(initializeChart);
        return;
      }

      try {
        // Create chart
        const chart = createChart(chartContainerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: '#9CA3AF',
          },
          grid: {
            vertLines: { color: '#374151' },
            horzLines: { color: '#374151' },
          },
          crosshair: {
            mode: 1,
          },
          rightPriceScale: {
            borderColor: '#374151',
          },
          timeScale: {
            borderColor: '#374151',
            timeVisible: true,
            secondsVisible: false,
          },
          width: chartContainerRef.current.clientWidth,
          height: height,
        });

        // Validate chart instance before proceeding
        if (!chart || typeof chart.addAreaSeries !== 'function') {
          console.error('Invalid chart instance or addAreaSeries method not available');
          // Retry on next animation frame
          animationFrameRef.current = requestAnimationFrame(initializeChart);
          return;
        }

        // Create area series
        const areaSeries = chart.addAreaSeries({
          lineColor: '#43D4A0',
          topColor: 'rgba(67, 212, 160, 0.4)',
          bottomColor: 'rgba(67, 212, 160, 0.0)',
          lineWidth: 2,
        });

        chartRef.current = chart;
        seriesRef.current = areaSeries;

        // Handle resize
        const handleResize = () => {
          if (chartContainerRef.current && chart) {
            chart.applyOptions({
              width: chartContainerRef.current.clientWidth,
            });
          }
        };

        window.addEventListener('resize', handleResize);

        // Store cleanup function
        const cleanup = () => {
          window.removeEventListener('resize', handleResize);
          if (chart) {
            chart.remove();
          }
          chartRef.current = null;
          seriesRef.current = null;
        };

        // Store cleanup for component unmount
        animationFrameRef.current = cleanup as any;
      } catch (error) {
        console.error('Error creating chart:', error);
        // Retry on next animation frame
        animationFrameRef.current = requestAnimationFrame(initializeChart);
      }
    };

    // Start initialization
    animationFrameRef.current = requestAnimationFrame(initializeChart);

    return () => {
      if (animationFrameRef.current) {
        if (typeof animationFrameRef.current === 'function') {
          animationFrameRef.current();
        } else {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = null;
      }
    };
  }, []); // Empty dependency array to run only once on mount

  // Update chart height when height prop changes
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.applyOptions({ height: height });
    }
  }, [height]);

  // Update data when timeframe or data prop changes
  useEffect(() => {
    if (seriesRef.current) {
      try {
        const chartData = data || generateMockData(timeframe);
        seriesRef.current.setData(chartData.map(point => ({
          time: point.time,
          value: point.value
        })));
      } catch (error) {
        console.error('Error updating chart data:', error);
      }
    }
  }, [timeframe, data]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base md:text-lg font-semibold">Performance Chart</h3>
        <div className="flex space-x-1 md:space-x-2">
          {['1H', '1D', '1W', '1M'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-2 md:px-3 py-1 text-xs md:text-sm rounded-lg transition-colors ${
                timeframe === period
                  ? 'bg-[#43D4A0] text-black font-medium'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      
      <div 
        ref={chartContainerRef} 
        className="w-full rounded-lg bg-gray-900/30"
        style={{ height: `${height}px` }}
      />
      
      <div className="mt-4 grid grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
        <div className="text-center">
          <div className="text-gray-400">24h Change</div>
          <div className="text-[#43D4A0] font-medium">+2.4%</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400">Volume</div>
          <div className="font-medium">$1.2M</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400">Trades</div>
          <div className="font-medium">247</div>
        </div>
      </div>
    </div>
  );
}