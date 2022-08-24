package com.stoneitgt.common;

import lombok.Data;

@Data
public class IPManagement {
	private int ipSeq;
	private String fromIp;
	private String toIp;
	private long fromIpLong;
	private long toIpLong;
}
