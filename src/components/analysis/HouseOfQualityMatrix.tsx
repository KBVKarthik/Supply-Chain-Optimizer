import React from 'react';
import { HouseOfQuality } from '../../types';

interface HouseOfQualityMatrixProps {
  hoq: HouseOfQuality;
}

export const HouseOfQualityMatrix: React.FC<HouseOfQualityMatrixProps> = ({ hoq }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">House of Quality Matrix</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-2 border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left font-semibold">Customer Needs</th>
              {hoq.technicalRequirements.map((req, idx) => (
                <th
                  key={idx}
                  className="border border-gray-300 p-3 text-center font-semibold text-sm min-w-24"
                >
                  <div className="transform -rotate-45 origin-center h-24 flex items-center justify-center">
                    {req.name}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hoq.customerNeeds.map((need, rowIdx) => (
              <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-300 p-3 font-medium text-sm">
                  <div>
                    <p>{need.name}</p>
                    <p className="text-xs text-gray-600">Importance: {need.importance}/5</p>
                  </div>
                </td>
                {hoq.relationshipMatrix[rowIdx].map((value, colIdx) => (
                  <td
                    key={colIdx}
                    className="border border-gray-300 p-3 text-center font-bold"
                  >
                    {value > 0 ? (
                      <div
                        className={`w-10 h-10 mx-auto rounded flex items-center justify-center text-white font-bold ${
                          value === 3
                            ? 'bg-red-600'
                            : value === 2
                              ? 'bg-yellow-500'
                              : 'bg-blue-500'
                        }`}
                      >
                        {value}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3">Technical Requirement Priorities</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hoq.technicalRequirements.map((req, idx) => (
            <div key={idx} className="bg-white rounded p-3 border border-blue-200">
              <p className="text-sm font-medium text-gray-700">{req.name}</p>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${(hoq.priorityScores[idx] / Math.max(...hoq.priorityScores)) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Score: {hoq.priorityScores[idx].toFixed(1)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600">
        <p>Relationship Values: <span className="inline-block w-4 h-4 bg-red-600 mr-1"></span>Strong (3) 
        <span className="inline-block w-4 h-4 bg-yellow-500 mr-1 ml-3"></span>Medium (2) 
        <span className="inline-block w-4 h-4 bg-blue-500 mr-1 ml-3"></span>Weak (1)</p>
      </div>
    </div>
  );
};
